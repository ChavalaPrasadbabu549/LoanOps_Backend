"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.setOtp = exports.generateOTP = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateOTP = (length = 6) => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    const otp = crypto_1.default.randomInt(min, max);
    return otp.toString();
};
exports.generateOTP = generateOTP;
const otpStore = {};
const setOtp = (email, otp, data) => {
    otpStore[email] = {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
        data
    };
};
exports.setOtp = setOtp;
const verifyOtp = (email, enteredOtp) => {
    const record = otpStore[email];
    if (!record)
        return false;
    if (record.expiresAt < Date.now()) {
        delete otpStore[email];
        return false;
    }
    if (record.otp !== enteredOtp)
        return false;
    const data = record.data;
    delete otpStore[email];
    return data;
};
exports.verifyOtp = verifyOtp;
