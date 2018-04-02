const express     = require('express');
var path          = require('path')
var fs            = require('fs')
const bodyParser  = require('body-parser');
const net         = require('net');
var https         = require('https')

// ===== Notifications =====
let userId = '24398957-5e73-4eaf-9c52-d171ac971dd5'

const notifications = require('./notifications');

// Setup initial broadcast group by asking REST server for broadcastgroup of this user
notifications.setupInitialBroadcastGroup(userId);
notifications.consumeNewBroadcastGroup(userId);


// ===== Socket =====
let client;

try 
{
  client = net.createConnection({ port: 8124, host: '0.0.0.0' }, () => {
    //'connect' listener
    console.log('connected to socket!');
  });

  // Receiving data from server
  client.on('data', (data) => {
    console.log('received acknowledgement for sent message');
  });

  // Ended connection
  client.on('end', () => {
    console.log('disconnected from socket');
  });
}
catch (err)
{
  console.log(err);
}


const sendLocation = (update) => {

  const buffer = Buffer.from(JSON.stringify(update));
  console.log('Tracker sent his location');
  client.write(buffer);
}

// ===== HTML =====

console.log('Init webserver');

const app = express();
app.use(bodyParser.urlencoded({'extended': 'true' }));
app.use(bodyParser.json());

const distDir = __dirname + "/dist/";
app.use(express.static(distDir));

app.post('/location', (req, res) => {
  res.sendStatus(200);

  sendLocation(req.body)
})

app.get('/*', function(req, res) {
  console.log('Serving the Geolocation Tracker HTML')
  res.sendFile(distDir + 'index.html');
});


// Create webserver
const port = process.env.PORT || 1111;


// var certOptions = {
//   key: fs.readFileSync(path.resolve('./build/cert/server.key')),
//   cert: fs.readFileSync(path.resolve('./build/cert/server.crt'))
// }

// var server = https.createServer(certOptions, app).listen(port, function(){
//   console.log("Express server listening on port " + port);
// });



app.listen(port);
