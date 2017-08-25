'use strict';

const express = require('express');
const controller = require('./controller');
const router = express.Router()


/* Authoriser API
  POST /api/authoriser/:voteID

  This method will return a distinct random contact object. If there is none, it returns an empty response.
 */
router.post('/:voteId', controller.sign);

// just send the json of the public key used for signing
router.get('/:voteId/key', controller.key);

module.exports = router;
