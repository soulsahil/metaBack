// const UserModel = require("../Models/User");
const jwt = require('jsonwebtoken');
const InfoModel = require("../Models/Info");
const BusinessUserModel = require("../Models/BusinessUser");
const Logins = require("../Models/User");


// Create a new info entry
exports.createInfo = async (req, res) => {
  console.log("Received request for createInfo");
    try {
      const { companyName, industryName, companyWebsite, companyType } = req.body;
      
      const latestLogin = await Logins.findOne().sort({ createdAt: -1 });
    if (!latestLogin) {
      return res.status(400).json({ success: false, message: "No login found" });
    }
    const latestLoginId = latestLogin._id;
    console.log("Latest loginId:", latestLoginId);

      // Create a new info instance
      const newInfo = new InfoModel({
        companyName,
        industryName,
        companyWebsite,
        companyType
      });
      console.log('crossed this');
      // Save the info to the database
      const savedInfo = await newInfo.save();

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
