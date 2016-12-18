const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(path.join(__dirname, '../client/')));

export default class App {

  constructor() {

    console.log("instantiate app - attach debugger now");

    this.photoTimer = null;

    setTimeout( () => {
      this.run();
    }, 1000);

    const port = process.env.PORT || 8080;
    app.listen(port);
  }


  fetchAlbums() {

    return new Promise( (resolve, reject) => {

      const getAlbumsUrl = "http://picasaweb.google.com/data/feed/api/user/shaffer.family";
      axios.get(getAlbumsUrl)
        .then(function (albumsResponse) {
          const xml = albumsResponse.data;
          const parseString = require('xml2js').parseString;
          parseString(xml, function (_, result) {
            resolve(result);
          });
        })
        .catch(function (albumsError) {
          console.log(albumsError);
          reject(albumsError);
        });
    });
  }

  fetchAlbum(albumId) {

    return new Promise( (resolve, reject) => {

      const getAlbumUrl = "http://picasaweb.google.com/data/feed/api/user/shaffer.family/albumid/" + albumId;

      axios.get(getAlbumUrl, {
        params: {albumId}
      }).then(function (albumResponse) {
        const xml = albumResponse.data;
        const parseString = require('xml2js').parseString;
        parseString(xml, function (_, result) {
          console.dir(result);
          resolve(result.feed);
        });
      })
      .catch(function (fetchAlbumError) {
        console.log(fetchAlbumError);
        reject(fetchAlbumError);
      });
    });
  }

  scaleImage(img, width, height ) {

    let scaleFactor = 1.0;

    const widthRatio = width / 1920;
    const heightRatio = height / 1080;
    if (widthRatio < 1 && heightRatio < 1) {
      scaleFactor = 1.0;
    }
    else if (widthRatio > heightRatio) {
      scaleFactor = widthRatio;
    }
    else {
      scaleFactor = heightRatio;
    }
    const scaledWidth = width / scaleFactor;
    const scaledHeight = height / scaleFactor;

    img.style.width = scaledWidth.toString() + "px";
    img.style.height = scaledHeight.toString() + "px";
  }


  playSlideShow(photos) {

    let photoIndex = 0;
    let photoWidth, photoHeight;

    console.log("Number of photos is: " + photos.length);

    document.getElementById("introMessage").style.display = "none";
    document.getElementById("deviceId").style.display = "none";

    if (this.photoTimer) {
      clearInterval(this.photoTimer);
    }

    const img = document.getElementById("mainImage");
    img.display = 'block';

    this.photoTimer = setInterval( () => {
      const photo = photos[photoIndex];
      const photoContent = photos[photoIndex].content[0].$;

      photoWidth = Number(photo['gphoto:width'][0]);
      photoHeight = Number(photo['gphoto:height'][0]);

      img.src = photoContent.src;

      photoIndex = (photoIndex + 1) % photos.length;
    }, 4000);

    // don't scale img until it's loaded - otherwise, existing image is displayed incorrectly until image downloads
    img.onload = () => {
      this.scaleImage(img, photoWidth, photoHeight);
    };
  }


  run() {

    console.log("launch shafferoogle server - listening on port 8080");

    app.get('/fetchAlbums', (_, res) => {
      res.set('Access-Control-Allow-Origin', '*');
      this.fetchAlbums().then( (albumsResponse) => {
        res.status(200).send(albumsResponse);
      })
      .catch( (albumsError) => {
        res.send(albumsError);
      });
    });

    app.get('/launchSlideShow', (req, res) => {
      console.log("launchSlideShow invoked");
      res.set('Access-Control-Allow-Origin', '*');
      const albumId = req.query.albumId;
      let promise = this.fetchAlbum(albumId);
      promise.then( (feed) => {
        this.playSlideShow(feed.entry);
      });
      res.status(200).send(null);
    });
  }
}