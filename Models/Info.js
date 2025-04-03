const mongoose = require('mongoose');
const mongooseSequence = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const InfoSchema = new Schema({
    businessId: {
        type: Number,
        unique: true
    },
    companyName: {
        type: String,
        required: true
    },
    industryName: {
        type: String,
        required: true
    },
    companyWebsite: {
        type: String,
        required: true
    },
    companyType: {
        type: String,
        enum: ["Brand"],
        required: true
    }
});

InfoSchema.plugin(mongooseSequence, { inc_field: 'businessId' });

const InfoModel = mongoose.model('businesses', InfoSchema);
module.exports = InfoModel;







