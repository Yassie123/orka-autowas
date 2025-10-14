// import mongoose from 'mongoose';


// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true},
//   email: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });


// const User = mongoose.model('User', userSchema);

// export default User;


/*test voor schema's*/
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  cars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

export default User;
