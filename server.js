const express     = require('express');
var path          = require('path')
var fs            = require('fs')
const bodyParser  = require('body-parser');
const net         = require('net');
var https         = require('https')

// ===== Socket =====
let client;

try 
{
  client = net.createConnection({ port: 8124, host: '192.168.178.16' }, () => {
    //'connect' listener
    console.log('connected to server!');
  });

  // Receiving data from server
  client.on('data', (data) => {
    console.log('received confirmation');
  });

  // Ended connection
  client.on('end', () => {
    console.log('disconnected from server');
  });
}
catch (err)
{
  console.log(err);
}


const sendLocation = (update) => {

  const buffer = Buffer.from(JSON.stringify(update));
  console.log('Sjors sent his location');
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
  console.log('Serving the HTML')
  res.sendFile(distDir + 'index.html');
});


// Create webserver
const port = process.env.PORT || 443;


var certOptions = {
  key: fs.readFileSync(path.resolve('./build/cert/server.key')),
  cert: fs.readFileSync(path.resolve('./build/cert/server.crt'))
}

// var server = https.createServer(certOptions, app).listen(1111)
var server = https.createServer(certOptions, app).listen(port, function(){
  console.log("Express server listening on port " + port);
});



// app.listen(port);
