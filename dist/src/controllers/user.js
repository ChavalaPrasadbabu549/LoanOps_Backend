"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.verifyOTP = exports.requestOTP = exports.registerUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const otp_1 = require("../utils/otp");
const email_1 = require("../utils/email");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
        expiresIn: '7d',
    });
};
const registerUser = async (req, res) => {
    try {
        const { name, email, number } = req.body;
        const image = req.file ? req.file.path : "";
        if (!name || !email || !number) {
            res.status(400).json({ success: false, message: 'All fields are required' });
            return;
        }
        const userExists = await user_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }
        const user = await user_1.default.create({
            name,
            email,
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
const requestOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ success: false, message: 'Email is required' });
            return;
        }
        const user = await user_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found, please register first' });
            return;
        }
        const otp = (0, otp_1.generateOTP)(6);
        (0, otp_1.setOtp)(email, otp, user);
        await (0, email_1.Sendotpmail)(user.email, otp);
        res.status(200).json({
            success: true,
            message: 'OTP sent to email successfully',
        });
    }
    catch (error) {
        console.error('Error in requestOTP:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.requestOTP = requestOTP;
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            res.status(400).json({ success: false, message: 'Email and OTP are required' });
            return;
        }
        const verifiedData = (0, otp_1.verifyOtp)(email, otp);
        if (!verifiedData) {
            res.status(401).json({ success: false, message: 'Invalid OTP' });
            return;
        }
        const user = verifiedData;
        const token = generateToken(user.id);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            data: user
        });
    }
    catch (error) {
        console.error('Error in verifyOTP:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.verifyOTP = verifyOTP;
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
