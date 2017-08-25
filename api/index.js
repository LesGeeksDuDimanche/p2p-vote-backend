'use strict';

module.exports = function (app) {
  app.use('/api/tracker', require('./tracker'));
  app.use('/api/authoriser', require('./authoriser'));
}
