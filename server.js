#!/usr/bin/env node

'use strict';


const port = process.env.PORT || 8080;
const ip = process.env.IP || undefined;


const express = require('express');
const http = require('http');

const app = express();
app.use(express.static('htdocs'));

// middleware for express
var cors = require('cors');
var bodyParser = require('body-parser')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// load API
require('./api')(app);

// load signalling
const server = http.createServer(app);
require('./signaller')(server);

// start server
server.listen(port, ip, function () {
  console.log('listening on port', port);
});
