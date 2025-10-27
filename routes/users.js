import express from 'express';
import User from '../models/user.js';
import Car from '../models/car.js'; // <-- add this


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

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ userId: newUser._id, user: newUser, message: 'User registered successfully' });
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

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.password !== password) return res.status(401).json({ message: 'Incorrect password' });

    res.json({ userId: user._id, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in', error: err });
  }
});

// ✅ GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
});

// ✅ GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err });
  }
});

// ✅ UPDATE user
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
// users.js
router.post('/:id/cars', async (req, res) => {
  try {
    const { id } = req.params;
    const { brand, model, licensePlate, color } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ Add the user field!
    const newCar = new Car({ 
      brand, 
      model, 
      licensePlate, 
      color,
      user: id  // <-- This was missing!
    });
    await newCar.save();

    user.cars.push(newCar._id);
    await user.save();

    res.status(201).json(newCar);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding car', error: err });
  }
});


export default router;
