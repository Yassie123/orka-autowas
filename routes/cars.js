import express from 'express';
import Car from '../models/cars.js';
import Wash from '../models/wash.js';
import User from '../models/user.js'; // ← Add this import!

const router = express.Router();

// GET car by ID
router.get('/:carId', async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    console.error('Error fetching car:', err);
    res.status(500).json({ message: 'Error fetching car', error: err.message });
  }
});

// GET all washes for a car
router.get('/:carId/washes', async (req, res) => {
  try {
    const washes = await Wash.find({ car: req.params.carId }).sort({ date: -1 });
    res.json({ washes });
  } catch (err) {
    console.error('Error fetching washes:', err);
    res.status(500).json({ message: 'Error fetching washes', error: err.message });
  }
});

// POST new wash for a car
router.post('/:carId/washes', async (req, res) => {
  try {
    const { carId } = req.params;
    const { type, notes, cost, location, date } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    const newWash = new Wash({
      car: carId,
      type,
      notes,
      cost,
      location,
      date: date || new Date(),
    });

    await newWash.save();
    res.status(201).json(newWash);
  } catch (err) {
    console.error('Error adding wash:', err);
    res.status(500).json({ message: 'Error adding wash', error: err.message });
  }
});

// GET single wash by ID
router.get('/washes/:washId', async (req, res) => {
  try {
    const wash = await Wash.findById(req.params.washId).populate('car');
    if (!wash) return res.status(404).json({ message: 'Wash not found' });
    res.json(wash);
  } catch (err) {
    console.error('Error fetching wash:', err);
    res.status(500).json({ message: 'Error fetching wash', error: err.message });
  }
});

// DELETE car by ID
router.delete('/:carId', async (req, res) => {
  try {
    const { carId } = req.params;
    
    // Delete all washes associated with this car
    await Wash.deleteMany({ car: carId });
    
    // Delete the car
    const deletedCar = await Car.findByIdAndDelete(carId);
    if (!deletedCar) return res.status(404).json({ message: 'Car not found' });
    
    // Remove car from user's cars array
    await User.updateOne(
      { cars: carId },
      { $pull: { cars: carId } }
    );
    
    res.json({ message: 'Car deleted successfully' });
  } catch (err) {
    console.error('Error deleting car:', err);
    res.status(500).json({ message: 'Error deleting car', error: err.message });
  }
});

export default router;