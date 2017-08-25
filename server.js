#!/usr/bin/env node

'use strict';


const port = process.env.PORT || 8080;


const express = require('express');
const http = require('http');

const app = express();
app.use(express.static('htdocs'));


const server = http.createServer(app).listen(port);

const signaller = require('./components/signaller.js');
signaller(server);


console.log('listening on port', port);
