const Tag = require('../models/tag');

module.exports = {
  getAll,
  create,
  update,
  delete: deleteTag
};

// Get all tags for the logged-in user
async function getAll(req, res) {
  try {
    const tags = await Tag.find({ userId: req.user._id });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Create a new tag
async function create(req, res) {
  try {
    // Add the user ID to the tag
    req.body.userId = req.user._id;
    
    const tag = await Tag.create(req.body);
    res.status(201).json(tag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Update a tag
async function update(req, res) {
  try {
    const tag = await Tag.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    
    res.json(tag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete a tag
async function deleteTag(req, res) {
  try {
    const tag = await Tag.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    
    res.json({ message: 'Tag deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}