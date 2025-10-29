import mongoose from 'mongoose';

const washSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, default: 'Regular wash' }, // e.g., "Regular wash", "Deep clean", "Wax", etc.
  notes: { type: String },
  cost: { type: Number },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Wash = mongoose.model('Wash', washSchema);
export default Wash;