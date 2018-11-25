const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const items = require('./routes/api/items')

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

// Use routes
app.use('/api/items', items);
// Serve Static assets if we are in production
if(process.env.node_env === 'production') {
  // Set static folders
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}
const port = process.env.PORT || 5000;

app.listen(port, () => console.log('Server started on port '+ port));