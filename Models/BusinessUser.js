const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bUserSchema = new Schema({
    businessId: {
        type: String,
        default: null
    },
    loginId: {
        type: String,
        required: true
    },
    userRole: {
        type: String,
        required: true,
        default: "admin"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const bUserModel = mongoose.model('businessUser', bUserSchema);
module.exports = bUserModel;

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const bUserSchema = new Schema({
    
//     businessId: {
//         type: String,
//         required: true,
//         ref: 'businesses'
//     },
//     loginId: {
//         type: String,
//         required: true,
//         ref: 'logins'
//     },
//     userRole: {
//         type: String,
//         required: true,
//         default:"admin"
//     },
// });

// const bUserModel = mongoose.model('businessUser', bUserSchema);
// module.exports = bUserModel;