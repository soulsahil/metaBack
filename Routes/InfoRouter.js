// routes/infoRoutes.js
const express = require('express');
const router = express.Router();
const infoController = require('../Controllers/InfoController'); // Adjust path as needed

// Create a new info entry
router.post('/', infoController.createInfo);

// Get all info entries
router.get('/', infoController.getAllInfo);

// Get info by ID
router.get('/:id', infoController.getInfoById);

// Update info
router.put('/:id', infoController.updateInfo);

// Delete info
router.delete('/:id', infoController.deleteInfo);

module.exports = router;