// Server init
const fs = require('fs-extra');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const sanitize = require('sanitize-html');
const Log = require('./log.js');
const Ban = require('./ban.js');
const Utils = require('./utils.js'); // Include utils.js
const Meat = require('./meat.js');
const Console = require('./console.js');

// Load settings or create a new settings file if it doesn't exist
let settings;
try {
  fs.statSync('settings.json');
  settings = require('./settings.json');
} catch (e) {
  if (e.code === 'ENOENT') {
    try {
      fs.copySync('settings.example.json', 'settings.json');
      console.log('Created new settings file.');
      settings = require('./settings.json');
    } catch (e) {
      console.log(e);
      throw "Could not create new settings file.";
    }
  } else {
    console.log(e);
    throw "Could not read 'settings.json'.";
  }
}

// Setup basic express server
const app = express();
if (settings.express.serveStatic) {
  app.use(express.static('../build/www'));
}
const server = http.createServer(app);

// Init socket.io
const io = socketIO(server);
const port = process.env.PORT || settings.port;
exports.io = io;

// Init winston loggers
Log.init();
const log = Log.log;

// Load ban list
Ban.init();

// Start actually listening
server.listen(port, () => {
  console.log(
    " Welcome to BonziWORLD!\n",
    "Time to meme!\n",
    "----------------------\n",
    "Server listening at port " + port
  );
});
app.use(express.static(__dirname + '/public'));

// The Beef(TM)
Meat.beat();

// Console commands
Console.listen();
