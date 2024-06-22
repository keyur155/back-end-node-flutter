const mongoose = require('mongoose');
const User = require('./user_model.js');
const esgSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    No_of_Recycled_items: {
        type: Number,
        required: true
    },
    Recycled_weight: {
        type: Number,
        required: true
    },
    Reduction_CO2_emission: {
        type: Number,
        required: true
    },
    Reduction_landfill: {
        type: Number,
        required: true
    },
    Reduction_water_consumption: {
        type: Number,
        required: true
    },
    No_of_items_that: {
        type: Number,
        required: true
    }
});

const ESG = mongoose.model('ESG', esgSchema);

module.exports = ESG;


