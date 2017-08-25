'use strict';

var _ = require('lodash');

var request = require('request');

// database
let votings = {};

var bignum = require('bignum');
var rsa = require('../../lib/rsa-bignum');

var keys = rsa.generateKeys(1024, function (keys) {
    console.log("Keys are ready!");
    console.log(keys);
});

exports.key = function (req, res) {
  var publickey = {
    bits: keys.publicKey.bits,
    n: keys.publicKey.n.toString(),
    e: keys.publicKey.e.toString()
  };
  res.send(JSON.stringify(publickey));
}

exports.sign = function (req, res) {
  const voteId = req.params.voteId;
  if(!voteId) {
    return res.status(406).send('no voteId');
  }

  if(!req.body.access_token) {
    return res.status(401).send('You do not have authentication (no token provided)');
  }

  request('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='+req.body.access_token, function (error, response, body) {
    if(error || (response && response.statusCode != 200)) {
      console.log('error:', error, 'statusCode:', response.statusCode); // Print the error if one occurred
      return res.status(401).send('You do not have authentication (token not valid)');
    }

    let user;
    try {
      user = JSON.parse(body);
    } catch (e) {
      return res.status(401).send('You do not have authentication (API error)');
    }

    console.log(user);

    if(user.audience != '785009904705-65k7sf0dk54uetqs90p7gvn59on8288u.apps.googleusercontent.com') {
      return res.status(401).send('You do not have authentication (wrong token audience)');
    }

    if(!user.email) {
      return res.status(401).send('You do not have authentication (email not given)');
    }

    if(!user.verified_email) {
      return res.status(401).send('You do not have authentication (email not verified)');
    }

    let registry = votings[voteId];
    if(!registry) {
      registry = {};
    }

    let userEntry = registry[user.email];
    if(!userEntry) {
      userEntry = {
        'email': user.email,
        'data': body.data,
        'registered': false
      };
    }

    if(userEntry.registered) {
      return res.status(401).send('Already registered!'); // idea, compare data and provide same sig again
    }

    // start signing
    // source: https://github.com/raullorenzo/FirmaCiega/blob/master/routes/index.js
    // Author: github/raullorenzo 2016

    var data = bignum(req.body.data);
    var d = keys.privateKey.d.toString();
    var n = keys.publicKey.n.toString();
    console.log('data', blind);
    //AQUI NO ME VA me salta que la bc.powm no es una funcion --que raro-- en pallier me pasa lo mismo//
    var teta = keys.privateKey.encrypt(blind);
    console.log('signed data', teta);
    //SI FUNCIONA LO ANTERIOR EL SERVIDOR TE DA UNA FIRMA VALIDA"

    registry[user.email] = userEntry;

    votings[voteId] = registry;

    return res.status(200).send(teta.toString());
  });
}
