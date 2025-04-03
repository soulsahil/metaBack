const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");
const BusinessUserModel = require("../Models/BusinessUser");

const signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        console.log("Received request body:", req.body);

        // Check if user already exists
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User already exists, you can login', success: false });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new UserModel({
            fullname,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const newBusinessUser = new BusinessUserModel({
            loginId: newUser._id
        });
        await newBusinessUser.save();

            const jwtToken = jwt.sign(
                { _id: newUser._id, email: newUser.email, name: newUser.fullname },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );
            console.log("Generated JWT Token:", jwtToken);
            res.status(201).json({
                message: "Signup successful",
                success: true,
                jwtToken,
                user: {
                    _id: newUser._id,
                    name: newUser.fullname,
                    email: newUser.email
                }
            });

    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server error",
                error: err.message,
                success: false
            });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(403).json({
                message: "Auth failed: Email or password is incorrect",
                success: false
            });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({
                message: "Auth failed: Email or password is incorrect",
                success: false
            });
        }

        const jwtToken = jwt.sign(
            { _id: user._id, email: user.email, name: user.fullname },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            user: {
                _id: user._id,
                name: user.fullname,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Login error:", err); // Improved logging
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

module.exports = {
    signup,
    login
};