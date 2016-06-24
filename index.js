'use strict'

const WebSocketServer = require('ws').Server;

let server = new WebSocketServer({ port: 8080 });

// array of connected sockets
let connectionPool = [];

server.on('connection', (ws) => {

  function broadcast(json) {
    console.log(`Broadcasing message: ${JSON.stringify(json)}`);
    connectionPool.forEach(socket => {
      if (socket !== ws) {
        socket.send(JSON.stringify(json));
      }
    });
  }

  connectionPool.push(ws);

  ws.on('message', function incoming(message) {
    let parsed = JSON.parse(message);

    switch (parsed.method) {
      case 'message':
        console.log(`${parsed.data}`);
        broadcast({
          "method" : "message",
          "data" : parsed.data,
          "sender" : parsed.sender
        });
        break;
      case 'name' :
        ws.username = parsed.data;
        broadcast({
          "method" : "joined",
          "data" : ws.username
        })
    }
  });

  ws.on('close', function() {
    broadcast({
      "method" : "left",
      "data" : ws.username
    })
  });

});

console.log(`Server listening to port 8080`)
