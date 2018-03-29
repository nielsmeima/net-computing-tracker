const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({'extended': 'false' }));
app.use(bodyParser.json());

const distDir = __dirname + "/dist/";
app.use(express.static(distDir));

app.get('/*', function(req, res) {
  res.sendFile(distDir + 'index.html');
});

const port = 1337;
app.listen(port);


