const express = require('express');
const router = express.Router();
const AccountController = require('../Controllers/AccountController');


// const { signup, login } = require('../Controllers/AuthController');

// Route definitions
router.post("/", AccountController.createOrUpdate);
router.get("/", AccountController.getAll);
router.get("/business/:businessId", AccountController.getByBusinessId);
router.get("/:id", AccountController.getById);
router.delete("/:id", AccountController.delete);

module.exports = router;





