'use strict';

module.exports = function (server) {

  const WebSocket = require('ws');
  const EventEmitter = require('events').EventEmitter;
  const signaller = new EventEmitter();
  const ws = new WebSocket.Server({ server });



  ws.on('connection', function(connection) {

    console.log('WebSocketServer connection');

    connection.on('message', function(data) {

      console.log()
      console.log('websocket message', new Date(), data);

      var parsed = JSON.parse(data);
      if(parsed.recipient && parsed.message) {
        return signaller.emit(parsed.recipient, parsed);
      }

      signaller.on(parsed.announceNick, function(message) {
        var json = JSON.stringify(message);
        console.log('websocket sending', json, 'to', parsed.announceNick);
        connection.send(json);
      });

      connection.on('close', function() {
        signaller.removeAllListeners(parsed.announceNick);
      });
    });
  });
}
