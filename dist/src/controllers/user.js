"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.loginUser = exports.registerUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
        expiresIn: '7d',
    });
};
const registerUser = async (req, res) => {
    try {
        const { name, email, number, password } = req.body;
        const image = req.file ? req.file.path : "";
        if (!name || !email || !number || !password) {
            res.status(400).json({ success: false, message: 'All fields including password are required' });
            return;
        }
        const userExists = await user_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(8);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await user_1.default.create({
            name,
            email,
            password: hashedPassword,
            number,
            profile: image,
        });
        if (user) {
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: user
            });
        }
        else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    }
    catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required' });
            return;
        }
        const user = await user_1.default.findOne({ email });
        if (!user || !user.password) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const token = generateToken(user.id);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            data: user
        });
    }
    catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.loginUser = loginUser;
const updateProfile = async (req, res) => {
    try {
        const { name, number, profile } = req.body;
        const image = req.file ? req.file.path : undefined;
        if (!req.user) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }
        const user = await user_1.default.findById(req.user._id);
        if (user) {
            user.name = name || user.name;
            user.number = number || user.number;
            user.profile = image || profile || user.profile;
            const updatedUser = await user.save();
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedUser
            });
        }
        else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    }
    catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.updateProfile = updateProfile;
