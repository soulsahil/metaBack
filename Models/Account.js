const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  businessId: String,
  meta_businesses: [
    {
      meta_business_id: String,
      meta_business_name: String,
      accounts: [
        {
          meta_ad_account_id: String,
          meta_ad_account_name: String
        }
      ]
    }
  ]
});

const Account = mongoose.model("business_meta_adaccounts", accountSchema);

module.exports = Account;


// const mongoose = require('mongoose');

// const accountSchema = new mongoose.Schema({
//   id: String,
//   businessId: String,
//   accounts: [
//     {
//       name: String,
//       adAccount: String,
//       AdAccountName:String
//     },
//   ],
// });

// const Account = mongoose.model("business_meta_adaccounts", accountSchema);

// module.exports = Account;