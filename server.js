var path = require("path");
var fs = require('fs');
var https = require('https');
var express = require("express");
var app = express();
var participants = require('./local/output/participants.json');
var stats = require('./local/output/stats.json');

app.set("port", process.env.PORT || 9090);
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile("index.html", {
    root: __dirname + "/public"
  });
})

app.get('/bundle.js', (req,res) => {
  res.sendFile("bundle.js", {
    root: __dirname + "/public"
  });
});

app.get('/images/*',(req,res) => {
  console.log(`Getting image File ${req.url}`);
  var splitted = req.url.split('/');
  var fileName = splitted[splitted.length - 1];
  res.sendFile(fileName, { root: __dirname + "/local/images" });
});

app.get('/meta', (req,res) => {
  res.json(participants);
})
// app.get('/stats', (req,res) => {
//   res.json(stats);
// })

app.listen(app.get("port"), () => {
  console.log("The server is listening on port", app.get("port"));
});