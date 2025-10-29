import mongoose from 'mongoose';

const washSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  date: { type: Date, default: Date.now },
  duration: { type: Number, default: 0 }, // in seconds
  cost: { type: Number, default: 0 }, // coins inserted
  programs: [{ type: String }], // array of program names clicked
  notes: { type: String },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Wash = mongoose.model('Wash', washSchema);
export default Wash;