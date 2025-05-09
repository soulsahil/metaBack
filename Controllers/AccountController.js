const Account = require('../Models/Account');
const jwt = require('jsonwebtoken');
const BusinessUserModel = require('../Models/BusinessUser');

const AccountController = {
  // Create or update an account
  createOrUpdate: async (req, res) => {
    const { meta_businesses } = req.body;
  
    if (!meta_businesses || !Array.isArray(meta_businesses) || meta_businesses.length === 0) {
      return res.status(400).json({ error: "meta_businesses array is required" });
    }
  
    for (const mb of meta_businesses) {
      if (
        !mb.meta_business_id ||
        !mb.meta_business_name ||
        !Array.isArray(mb.accounts) ||
        mb.accounts.some(acc => !acc.meta_ad_account_id || !acc.meta_ad_account_name)
      ) {
        return res.status(400).json({ error: "Invalid meta business or account data" });
      }
    }
  
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Unauthorized, token missing" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const loginId = decoded._id;
  
      const businessUser = await BusinessUserModel.findOne({ loginId });
      if (!businessUser || !businessUser.businessId) {
        return res.status(404).json({ error: "Business ID not found for this user" });
      }
  
      const businessId = businessUser.businessId;
      let existingAccount = await Account.findOne({ businessId });
  
      if (existingAccount) {
        for (const mb of meta_businesses) {
          const existingMB = existingAccount.meta_businesses.find(
            b => b.meta_business_id === mb.meta_business_id
          );
  
          if (existingMB) {
            existingMB.accounts = mb.accounts;
          } else {
            existingAccount.meta_businesses.push(mb);
          }
        }
  
        await existingAccount.save();
        return res.json({ message: "Updated successfully", data: existingAccount });
      } else {
        const newAccount = await Account.create({
          businessId,
          meta_businesses,
        });
  
        return res.status(201).json({ message: "Created successfully", data: newAccount });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },  

  // Get all accounts
  getAll: async (req, res) => {
    try {
      const accounts = await Account.find();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get account by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const account = await Account.findOne({"meta_businesses.meta_business_id": id });
      
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }

      res.json(account);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete account by ID
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Account.updateMany(
        {},
        { $pull: { meta_businesses: { meta_business_id: id } } }
      );
      res.json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get ad accounts by businessId
  getByBusinessId: async (req, res) => {
    try {
        const { businessId } = req.params;
        if (!businessId) {
            return res.status(400).json({ error: "Business ID is required" });
        }

        const accounts = await Account.find({ businessId });
  
        if (!accounts.length) {
            return res.status(404).json({ error: "No ad accounts found for this business ID" });
        }

        res.json({ success: true, data: accounts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }

};



module.exports = AccountController;
