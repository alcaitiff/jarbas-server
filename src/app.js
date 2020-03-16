const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const JarbasBrain = require('./JarbasBrain.js');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.get('/', (req, res) => {
  res.send(
    {
      q: req.query.q,
      r: JarbasBrain.process(req.query.q)
    }
  );
});

app.get('/sys', (req, res) => {
  res.send(
    {
      q: req.query.q,
      r: JarbasBrain.sys(req.query.q)
    }
  );
});

app.listen(process.env.PORT || 8081);