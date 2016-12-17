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
      res.set('Access-Control-Allow-Origin', '*');
      const albumId = req.query.albumId;
      document.getElementById("main").innerHTML += "Launch slide show using albumId: " + albumId + "<br>";
      let promise = this.fetchAlbum(albumId);
      promise.then( (feed) => {
        console.log("Number of photos is: " + feed.entry.length);
        feed.entry.forEach( (photo) => {
          const photoUrl = photo.content[0].$.src;
          const photoType = photo.content[0].$.type;
        });
      });
      res.status(200).send(null);
    });
  }
}