import express from 'express';
import dotenv from 'dotenv';
import testRouter from './routes/test.js';
import indexRouter from './routes/index.js';
import messagesRouter from './routes/messages.js'; // 👈 import messages router
import mongoose from 'mongoose';
import usersRoute from './routes/users.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.static('public'));



mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
// Routers
app.use('/', indexRouter);
app.use('/api/test', testRouter);
app.use('/api/messages', messagesRouter); // 👈 mount messages router
app.use('/api/users', usersRoute);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


