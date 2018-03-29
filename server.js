const express = require('express');
const bodyParser = require('body-parser');

console.log('Init webserver');

const app = express();
app.use(bodyParser.urlencoded({'extended': 'true' }));
app.use(bodyParser.json());

const distDir = __dirname + "/dist/";
app.use(express.static(distDir));

app.post('/location', (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
})

app.get('/*', function(req, res) {
  console.log('Serving the HTML')
  res.sendFile(distDir + 'index.html');
});

const port = process.env.PORT || 3000;
app.listen(port);


