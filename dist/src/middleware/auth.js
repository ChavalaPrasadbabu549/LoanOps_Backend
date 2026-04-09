"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // Decode token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback-secret');
            // Find user by ID
            const user = await user_1.default.findById(decoded.id).select('-otp -otpExpiry');
            if (!user) {
                res.status(401).json({ success: false, message: 'Not authorized, user not found' });
                return;
            }
            req.user = user;
            next();
        }
        catch (error) {
            console.error('Authentication Error:', error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }
    else {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};
exports.protect = protect;
