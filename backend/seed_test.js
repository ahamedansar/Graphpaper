const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const User = require('./models/User');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('Connected to DB');
    await User.deleteMany({});
    console.log('Users deleted');
    const user = await User.create({
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'password123',
        role: 'admin',
        isVerified: true
    });
    console.log('Admin user saved. Hashed: ', user.password);
    process.exit(0);
}).catch(console.error);
