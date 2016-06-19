'use strict'

const WebSocketServer = require('ws').Server;

let server = new WebSocketServer({ port: 8080 });

// array of connected sockets
let connectionPool = [];

server.on('connection', (ws) => {

  connectionPool.push(ws);
  let bot = setInterval(() => ws.send("TESTING"), 3000);

  ws.on('message', function incoming(message) {
    let parsed = JSON.parse(message);

    if (parsed.method === 'message') {
      console.log(`${parsed.message}`);
    }

  });

  ws.on('close', function() {
    clearInterval(bot);
  });


});

console.log(`Server listening to port 8080`)
