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

    this.imageUrl = "";

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

  scaleImage(width, height, img) {

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

        const photos = feed.entry;

        console.log("Number of photos is: " + photos.length);

        const img = document.getElementById("mainImage");
        img.display = 'block';

        img.onload = () => {
          this.scaleImage(this.photoWidth, this.photoHeight, img);
          console.log("img.onload invoked: ", this.imageUrl);
        };

        let photoIndex = 0;
        setInterval( () => {
          const photo = photos[photoIndex];
          const photoContent = photos[photoIndex].content[0].$;

          this.photoWidth = Number(photo['gphoto:width'][0]);
          this.photoHeight = Number(photo['gphoto:height'][0]);
          // this.scaleImage(photoWidth, photoHeight, img);

          this.imageUrl = photoContent.src;
          console.log("set img.src: ", photoContent.src);
          img.src = photoContent.src;

          photoIndex = (photoIndex + 1) % photos.length;
        }, 4000);

      });
      res.status(200).send(null);
    });
  }
}