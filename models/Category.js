const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    subcategories: {
        type: [String],
        required: true,
    }
});