import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  licensePlate: { type: String, required: true, unique: true },
  color: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  // Remove the cars array - it doesn't belong here!
});

const Car = mongoose.model('Car', carSchema);


export default Car;