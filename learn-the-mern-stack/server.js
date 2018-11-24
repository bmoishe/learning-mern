const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

//Body Parser middleware
app.use(bodyParser.json());
// DB config. this is getting hidden variable from my config file
const db = require('./config/keys').mongoURI;

// Connect to mongodb
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log('Server started on port '+ port));
