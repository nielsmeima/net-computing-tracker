const express = require('express');
const bodyParser = require('body-parser');

console.log('Init webserver');

const app = express();
app.use(bodyParser.urlencoded({'extended': 'false' }));
app.use(bodyParser.json());

const distDir = __dirname + "/dist/";
app.use(express.static(distDir));

app.get('/*', function(req, res) {
  console.log('Serving the HTML')
  res.sendFile(distDir + 'index.html');
});

const port = process.env.PORT || 3000;
app.listen(port);


