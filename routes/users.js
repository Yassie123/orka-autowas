import express from 'express';
import User from '../models/user.js';

const router = express.Router();

// ✅ REGISTER: Create a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ username, email, password, cars: [] });
    await newUser.save();

    // Populate cars (empty array for new user)
    const populatedUser = await newUser.populate('cars');

    res.status(201).json({ userId: populatedUser._id, user: populatedUser, message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

// ✅ LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    let user = await User.findOne({ email }).populate('cars');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Optional: compare password if hashed
    if (user.password !== password) return res.status(401).json({ message: 'Incorrect password' });

    res.json({ userId: user._id, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in', error: err });
  }
});

// ✅ GET all users (with cars)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('cars');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
});

// ✅ GET user by ID (with cars)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('cars');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err });
  }
});

// ✅ UPDATE user
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('cars');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: 'Error updating user', error: err });
  }
});

// ✅ DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
});

export default router;
