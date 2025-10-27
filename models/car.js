import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  licensePlate: { type: String, required: true, unique: true },
  color: { type: String }, // optional, since you mentioned a color field
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // link to user
  createdAt: { type: Date, default: Date.now },
});

const Car = mongoose.model('Car', carSchema);

export default Car;
