const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// const http = require('http');
// const url = require('url');
// const fs = require('fs');
const axios = require('axios');
// const xml2js = require('xml2js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(path.join(__dirname, '../client/')));

export default class App {

  constructor() {
    console.log("instantiate app");
    console.log("attach debugger now");
    setTimeout( () => {
      this.run();
    }, 5000);

    const port = process.env.PORT || 8080;
    app.listen(port);
  }


  fetchAlbum(albumId) {

    return new Promise( (resolve, reject) => {

      const getAlbumUrl = "http://picasaweb.google.com/data/feed/api/user/shaffer.family/albumid/" + albumId;

      axios.get(getAlbumUrl, {
        params: {albumId}
      }).then(function (albumResponse) {
        console.log(albumResponse);
        console.log("success");

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

  run() {

    console.log("launch shafferoogle server - listening on port 8080");

    app.get('/fetchAlbums', (_, res) => {
      res.set('Access-Control-Allow-Origin', '*');

      console.log("fetchAlbums invoked");

      var getAlbumsUrl = "http://picasaweb.google.com/data/feed/api/user/shaffer.family";
      axios.get(getAlbumsUrl)
        .then(function (albumsResponse) {
          console.log(albumsResponse);
          console.log("success");

          var xml = albumsResponse.data;

          var parseString = require('xml2js').parseString;
          parseString(xml, function (_, result) {
            console.dir(result);
            // res.send(result);
            res.status(200).send(result);
          });
        })
        .catch(function (albumsError) {
          console.log(albumsError);
          res.send(albumsError);
        });
    });

    app.get('/launchSlideShow', (req, res) => {

      res.set('Access-Control-Allow-Origin', '*');

      const albumId = req.query.albumId;
      console.log("launchSlideShow invoked: ", albumId);

      let promise = this.fetchAlbum(albumId);
      promise.then( (feed) => {
        console.log("launchSlideShow, album details are:");
        console.log(feed);

        console.log("Number of photos is: " + feed.entry.length);

        feed.entry.forEach( (photo) => {
          const photoUrl = photo.content[0].$.src;
          console.log(photoUrl);
          const photoType = photo.content[0].$.type;
          console.log(photoType);
        });
      });
      res.status(200).send(null);
    });
  }
}