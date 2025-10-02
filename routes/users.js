import express from 'express';
import User from '../models/user.js';

const router = express.Router();


// ✅ GET: Retrieve all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ user: 'Error retrieving users', error });
  }
});
// ✅ GET: Retrieve a specific user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ user: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ user: 'Invalid user ID', error: error.user });
  }
});
// ✅ POST: Add a new user
router.post('/', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ user: 'Error adding user', error });
  }
});

// ✅ PUT: Update an existing user
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ user: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ user: 'Error updating user', error });
  }
});

// ✅ DELETE: Remove a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.json({ user: 'User deleted successfully!' });
    } else {
      res.status(404).json({ user: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ user: 'Error deleting user', error });
  }
});

export default router;