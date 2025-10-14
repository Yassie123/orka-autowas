import express from 'express';
import User from '../models/user.js';
import Car from '../models/car.js';

const router = express.Router();


// ✅ Login / find or create user
router.post('/login', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: 'Username required' });

    let user = await User.findOne({ username }).populate('cars');

    if (!user) {
      // Default autos bij eerste aanmaak
      const defaultCars = [
        { brand: 'Tesla', model: 'Model 3', licensePlate: '123-XYZ' },
        { brand: 'BMW', model: 'X5', licensePlate: '456-ABC' }
      ];

      const carIds = [];
      for (let carData of defaultCars) {
        let car = await Car.findOne({ licensePlate: carData.licensePlate });
        if (!car) car = await Car.create(carData);
        carIds.push(car._id);
      }

      user = new User({ username, cars: carIds });
      await user.save();
      user = await user.populate('cars');
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// ✅ Voeg nieuwe auto toe aan bestaande user
router.post('/:id/cars', async (req, res) => {
  try {
    const { brand, model, licensePlate } = req.body;
    if (!brand || !model || !licensePlate)
      return res.status(400).json({ message: 'All fields required' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let car = await Car.findOne({ licensePlate });
    if (!car) car = await Car.create({ brand, model, licensePlate });

    if (!user.cars.includes(car._id)) {
      user.cars.push(car._id);
      await user.save();
    }

    res.json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding car', error });
  }
});

// ✅ GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('cars');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
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