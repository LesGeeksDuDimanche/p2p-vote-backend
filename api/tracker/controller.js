'use strict';

var _ = require('lodash');

// database
let votings = {};

// how many uniquc contacts should be stored at most per voting
const maxContacts = 20;

/*
const cleanIntervall = 1000*60*10; /// 10 minutes;
const expireAfter = 1000*60*30; // 30 minutes
setInterval(function() {
  // delete old items
}, cleanIntervall);
*/

exports.random = function (req, res) {
  const voteId = req.params.voteId;
  if(!voteId) {
    return res.status(406).send('no voteId');
  }

  let contact = req.body;

  if(!contact) {
    return res.status(406).send('no contact');
  }

  let contacts = votings[voteId];
  if(!contacts) {
    contacts = [];
  }

  // find random distinct contact
  let randomContact = _.sample(_.filter(contacts, function(aContact) {return aContact._id != contact._id;}));

  contacts.unshift({
    '_id': contact._id,
    'data': contact
  });

  contacts = _.uniqBy(contacts, '_id');
  contacts = contacts.slice(0, maxContacts);


  votings[voteId] = contacts;

  return res.status(200).json(randomContact && randomContact.data);
}
