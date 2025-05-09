// const UserModel = require("../Models/User");
const jwt = require('jsonwebtoken');
const InfoModel = require("../Models/Info");
const BusinessUserModel = require("../Models/BusinessUser");
const Logins = require("../Models/User");
const PostingAdSpend = require("../Models/PostingAdSpend");


// Create a new info entry
exports.createInfo = async (req, res) => {
  console.log("Received request for createInfo");
    try {
      const { companyName, industryName, companyWebsite, companyType, meta_access_token } = req.body;
      
      const latestLogin = await Logins.findOne().sort({ createdAt: -1 });
    if (!latestLogin) {
      return res.status(400).json({ success: false, message: "No login found" });
    }
    const latestLoginId = latestLogin._id;
    console.log("Latest loginId:", latestLoginId);

      // Create a new info instance
      let savedInfo = await InfoModel.findOne({ companyName, companyWebsite });

      if (savedInfo) {
        console.log("Info already exists. Using existing entry.");
        if (meta_access_token) {
          savedInfo.meta_access_token = meta_access_token;
          savedInfo = await savedInfo.save();
        }
      } else {
        const newInfo = new InfoModel({
          companyName,
          industryName,
          companyWebsite,
          companyType,
          meta_access_token: meta_access_token || undefined
        });
        savedInfo = await newInfo.save();
        console.log("New info saved.");
      }

      const updatedBusinessUser = await BusinessUserModel.findOneAndUpdate(
        { loginId: latestLoginId },
        { $set: { businessId: savedInfo._id } },
        { new: true, upsert: true }
      );
      console.log("Updated BusinessUser:", updatedBusinessUser);
  
      // Return success response
      res.status(201).json({
        success: true,
        message: 'Info created successfully',
        data: savedInfo
      });
    } catch (error) {
      // Handle errors
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  // Add meta access token to an existing info entry
  exports.addMetaAccessTokenByObjectId = async (req, res) => {
    try {
      const { meta_access_token } = req.body;
      const { id } = req.params;
  
      const updatedInfo = await InfoModel.findByIdAndUpdate(
        id,
        { meta_access_token },
        { new: true }
      );
  
      if (!updatedInfo) {
        return res.status(404).json({ success: false, message: 'Business not found' });
      }
  
      res.status(200).json({
        success: true,
        message: 'Access token updated successfully',
        data: updatedInfo
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  
  
  // Get all info entries
  exports.getAllInfo = async (req, res) => {
    try {
      const info = await InfoModel.find();
      res.status(200).json({
        success: true,
        count: info.length,
        data: info
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  // Get info by ID
  exports.getInfoById = async (req, res) => {
    try {
      const info = await InfoModel.findById(req.params.id);
      if (!info) {
        return res.status(404).json({
          success: false,
          message: 'Info not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: info
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  // Update info
  exports.updateInfo = async (req, res) => {
    try {
      const info = await InfoModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!info) {
        return res.status(404).json({
          success: false,
          message: 'Info not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Info updated successfully',
        data: info
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  // Delete info
  exports.deleteInfo = async (req, res) => {
    try {
      const info = await InfoModel.findByIdAndDelete(req.params.id);
      
      if (!info) {
        return res.status(404).json({
          success: false,
          message: 'Info not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Info deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

exports.getAdSpendByBusinessId = async (req, res) => {
    try {
      const { businessId } = req.params;
      const adSpends = await PostingAdSpend.find({ businessId });
  
      res.status(200).json({
        success: true,
        count: adSpends.length,
        data: adSpends,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
