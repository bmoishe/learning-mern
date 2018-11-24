const express = require('express');
const router = express.Router();

// Item Model
const Item = require('../../models/Items');

// @route GET api/items
// @desc Get All items
// @access Public
router.get('/', (req, res) => {
  Item.find()
    .sort({ date: -1})
    .then(items => res.json(items));
});

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


module.exports = router;
