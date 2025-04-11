const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postingAdSpendSchema = new Schema({
    postingId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    businessId: {
        type: String,
        required: true
    },
    businessCampaignId: {
        type: String,
        default: null
    },
    metaAdAccountId: {
        type: String,
        required: true
    },
    metaAdId: {
        type: String,
        required: true
    },
    campaignId: {
        type: String,
        default: null
    },
    adSetId: {
        type: String,
        default: null
    },
    adCreativeId: {
        type: String,
        default: null
    },
    spend: {
        type: Number,
        default: 0
    },
    clicks: {
        type: Number,
        default: 0
    },
    conversions: {
        type: Number,
        default: 0
    },
    revenue: {
        type: Number,
        default: 0
    },
    instagram_permalink: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const postingAdSpendModel = mongoose.model('posting_ad_spend', postingAdSpendSchema);
module.exports = postingAdSpendModel;
