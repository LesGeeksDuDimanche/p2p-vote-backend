'use strict';

const express = require('express');
const controller = require('./controller');
const router = express.Router()


/* Tracker API
  PUT /api/tracker/:voteID/random

  Body: object with attribute _id and other attributes required for tracking
  Example Body: {'_id': 'myId', 'port': '2020'}

  This method will return a distinct random contact object. If there is none, it returns an empty response.
 */
router.put('/:voteId/random', controller.random);

module.exports = router;
