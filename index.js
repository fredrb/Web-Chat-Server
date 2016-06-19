'use strict'

const WebSocketServer = require('ws').Server;

let server = new WebSocketServer({ port: 8080 });

// array of connected sockets
let connectionPool = [];

server.on('connection', (ws) => {

  connectionPool.push(ws);
  let bot = setInterval(() => ws.send(JSON.stringify({
    "method": "message",
    "data" : "Test data!",
    "sender" : "Some dude"
  })), 3000);

  ws.on('message', function incoming(message) {
    let parsed = JSON.parse(message);

    switch (parsed.method) {
      case 'message':
        console.log(`${parsed.data}`);
        break;
      case 'name' :
        ws.username = parsed.data;
    }

  });

  ws.on('close', function() {
    clearInterval(bot);
  });


});

console.log(`Server listening to port 8080`)
