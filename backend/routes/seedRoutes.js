const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

router.get('/', async (req, res) => {
    try {
        await User.deleteMany({});
        await Product.deleteMany({});

        // Create Users
        const usersToCreate = [
            {
                name: 'Admin User',
                email: 'admin@gmail.com',
                password: 'password123',
                role: 'admin',
                isVerified: true
            },
            {
                name: 'Delivery Boy',
                email: 'delivery@gmail.com',
                password: 'password123',
                role: 'delivery_boy',
                phone: '+91 9876543210',
                isVerified: true
            },
            {
                name: 'Retail Partner (User)',
                email: 'user@gmail.com',
                password: 'password123',
                role: 'user',
                isVerified: true
            }
        ];

        const createdUsers = [];
        for (const user of usersToCreate) {
            const createdUser = await User.create(user);
            createdUsers.push(createdUser);
        }

        const adminUser = createdUsers[0]._id;

        // Massive Product Generation
        const genders = ['Men', 'Women', 'Kids'];
        const categories = ['T-Shirts', 'Tracksuits', 'Sweatshirts', 'Hoodies', 'Jackets'];
        const styleNames = ['Essential', 'Premium', 'Oversized', 'Classic', 'Tech-Fit', 'Vintage', 'Executive'];
        
        const stylePrices = {
            'T-Shirts': 299,
            'Tracksuits': 999,
            'Sweatshirts': 599,
            'Hoodies': 799,
            'Jackets': 1299
        };

        const sampleProducts = [];

        for (const gender of genders) {
            for (const category of categories) {
                for (let i = 0; i < 7; i++) {
                    const styleName = styleNames[i];
                    let imagePath = '';

                    // Image Mapping Logic (Style-based)
                    if (category === 'T-Shirts') imagePath = `/images/tshirt_${i + 1}.png`;
                    else if (category === 'Tracksuits') imagePath = `/images/tracksuit_${i + 1}.png`;
                    else if (category === 'Sweatshirts') imagePath = `/images/tshirt_${i + 1}.png`; // Reuse tshirt visuals for variety
                    else if (category === 'Hoodies') {
                        if (i < 3) imagePath = `/images/hoodie_${i + 1}.png`;
                        else imagePath = `/images/tracksuit_${i - 2}.png`; // Reuse tracksuit visuals
                    } else if (category === 'Jackets') {
                        imagePath = `/images/tracksuit_${(i % 7) + 1}.png`; // Reuse tracksuit visuals
                    }

                    sampleProducts.push({
                        name: `${gender} ${styleName} ${category.slice(0, -1)}`,
                        image: imagePath,
                        description: `Premium grade ${gender} ${styleName} ${category.slice(0, -1)} specifically designed for wholesale retailers. High-quality fabric with minimum order of 10 units per size.`,
                        category: category,
                        genderCategory: gender,
                        sizes: ['S', 'M', 'L', 'XL'],
                        price: stylePrices[category] + (i * 50),
                        countInStock: 500 + (i * 20),
                        user: adminUser
                    });
                }
            }
        }

        await Product.insertMany(sampleProducts);

        res.json({ message: `Database successfully seeded with 3 users and ${sampleProducts.length} products!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error seeding database', error: error.message });
    }
});

module.exports = router;
