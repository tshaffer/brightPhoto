const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// const http = require('http');
// const url = require('url');
// const fs = require('fs');
const axios = require('axios');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(path.join(__dirname, '../client/')));

export default class App {

  constructor() {
    console.log("instantiate app");
    console.log("attach debugger now");
    setTimeout( () => {
      this.run();
    }, 30000);

    var port = process.env.PORT || 8080;
    app.listen(port);
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
  }
}