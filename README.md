# Learning the MERN stack
I will follow a tutorial by Travesty Media that teaches how to learn the MERN stack.

## What does the MERN stack consist of?

<b>MongoDB:

No SQL Data base

<b>Express:

 Backend framework (mostly used for building API's)

<b> React:

 Frontend UI library/ framework

<b>Node JS:

JS runtime (allows to use javascript as a server side technology).

## Getting started
```npm init ``` - this Creates a package JSON file.

```npm i express body-parser mongoose concurrently ```

- express to create routes

- body-parser to handle data as it comes in

- mongoose interact with library

- concurrently to run more than 1 npm script at a time. This will enable us to run the server and the client at the same time.

``` npm i -D nodemon```
nodemon allows me to save changes in the server and not need to reboot in order to see these changes, the -D saves it as a dev dependency

Add the following scripts to the package JSON to enable nodemon to work:

```


"start: " 'node server.js'
"server: " 'nodemon server.js'


```
to run nodemon (we will use this later when this is set up) ``` npm run server ```

Now to create the server.js file and connect to the database.

## Server.js file

``` Javascript
// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// requires dependencies
const app = express();
// connect to express

app.use(bodyParser.json());
//Body Parser middleware

```
Now got to mlab, set up a database and copy the URI.

I saved my URI to a folder on the root called config and in a file called keys.js. (config/keys.js). I set a this to

I exported this as an object with mongoURI as the key.

``` Javascript
// config/keys.js
module.exports = {
  mongoURI: 'mongodb://<dbuser>:<dbpassword>@ds09876ect...'
}
```
I then refer back to this from my server.js
``` Javascript
// server.js
// DB config. this is getting hidden variable from my config file
const db = require('./config/keys').mongoURI;

```
Now I need to connect to Mongo DB using mongoose and pass in the db object
``` Javascript
// server.js
// Connect to mongoDB
mongoose
  .connect(db)
  //after connection attempt return the following
  .then(() => console.log('MongoDB Connected...'))
  //if it errors then return the error
  .catch(err => console.log(err));

// now to run server we want to connect to a port. The process.env.PORT allow me to connect to an external server. I have it to go to port 5000 if not.
const port = process.env.PORT || 5000;

app.listen(port, () => console.log('Server started on port '+ port));
// this will listen on this port and callback when it starts on that port

```
Now I should be able to use ```npm run server ``` in the command line and start the sever.

## Now to set up the API
This is to get request from the front end to fetch items, post items and delete them from the database.

I need to create a model.

- Create a folder called models and a file called Items.js at the root (models/Items.js). In this file we need to set up a Schema:

``` Javascript
// models/Items.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ItemSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Item = mongoose.model('item', ItemSchema);
// this allows access to the file
```
- Create a folder called routes and a subfolder called api at the root. In the api folder create a file called items.js (routes/api/items.js). Then require this from the sever file. This keeps the code clean and separates the api that will just return json.

``` Javascript
// server.js

const items = require('./routes/api/items')

```

- We also want any request that goes to api/ items to use this file. So we need to add this to the server.js code as well above the definition of the port.

```Javascript
// server.js

// Use routes
app.use('/api/items', items);

```

- This will make it refer to the items variable. Now we need to set up the items api:


``` Javascript
// ./routes/api/items
const express = require('express');
const router = express.Router();

// Item Model
const Item = require('../../models/Items')

// At the bottom to make this accessible
module.exports = router;
```
- Now we can create some routes

``` Javascript

// @route GET api/items
// @desc Get All items
// @access Public
router.get('/', (req, res) => {
  Item.find()
    .sort({ date: -1})
    .then(items => res.json(items));
});
```
- To test this API used Post man. This shows a 200 response and an empty array. This means the route is working.
![postman returning an empty array](postman.png)

- Now to set up our post end point. Copy the code we right earlier for our get request and change it to a post request

``` Javascript
// routes/api/items.js

// @route POST api/items
// @desc Create a item
// @access Public
router.post('/', (req, res) => {
  const newItem = new Item({
    name: req.body.name
  });
  newItem.save().then(item => res.json(item));
  // This saves to the database and returns it in json
});

```

- We can test this in Post man by entering a post to the database. ![post request](post_req_postman.png)

- If you then check in the database its is now save in MongoDB. ![saved item post request](saved_in_mongo_db.png).

- Next we need to be able to delete an item. We can copy the code we made for both post and get then change it delete request (we will need to specify an id).

``` Javascript
// routes/api/items.js

// @route DELETE api/items/:id
// @desc Delete an item
// @access Public
router.delete('/:id', (req, res) => {
  // /:id is a placeholder for what we pass in as an id
  Item.findById(req.params.id)
  // req.params.id gets id from the params we pass
    .then(item => item.remove().then(() => res.json({ success: true})))
    .catch(err => res.status(404).json({ success: false}));
});

```

- I can test this with a delete request in postman ![delete item request](delete_req.png).

Now the Backend API is complete.
