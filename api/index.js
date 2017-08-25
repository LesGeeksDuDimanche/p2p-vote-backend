'use strict';

module.exports = function (app) {
  app.use('/api/tracker', require('./tracker')); 
}
