require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
  console.log('Connecting...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected! Testing insert...');
  
  try {
    const user = await User.create({ name: 'Test', email: 'test_db@gmail.com', password: 'password123' });
    console.log('Insert success!', user._id);
  } catch (err) {
    console.log('Insert error!', err.message);
  }
  process.exit(0);
}
test();
