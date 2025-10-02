import express from 'express';
const router = express.Router();

// Sample test route
router.get('/', (req, res) => {
  res.json({ message: 'This is a bomb!' });
});

export default router;