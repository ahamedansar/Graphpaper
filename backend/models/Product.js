const mongoose = require('mongoose');

const pricingTierSchema = mongoose.Schema({
    minQuantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

const productSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            // Cloudinary URL
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        genderCategory: {
            type: String,
            required: true,
            default: 'Adult',
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        sizes: {
            type: [String],
            default: ['S', 'M', 'L', 'XL', 'XXL'],
        },
        countInStock: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
