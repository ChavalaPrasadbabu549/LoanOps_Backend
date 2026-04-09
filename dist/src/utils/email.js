"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sendotpmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const Sendotpmail = async (to, otp) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            },
        });
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to,
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}`,
            html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; text-align: center; color: #333; border: 1px solid #eaeaea; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <h2 style="color: #2563eb; margin-bottom: 15px; font-size: 24px;">Verify Access</h2>
          <p style="font-size: 16px; margin-bottom: 25px; line-height: 1.5;">To continue your secure access, please use the One-Time Password (OTP) below:</p>
          <div style="background-color: #f3f4f6; padding: 20px 40px; border-radius: 8px; display: inline-block; margin-bottom: 25px; border: 1px solid #e5e7eb;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1e40af; margin-right: -8px;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #6b7280; line-height: 1.5; margin-bottom: 20px;">This code is valid for <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
          <div style="border-top: 1px solid #eaeaea; padding-top: 20px; margin-top: 20px;">
            <p style="font-size: 12px; color: #9ca3af;">If you did not request this login code, you can safely ignore this email.</p>
          </div>
        </div>
      `,
        });
        return true;
    }
    catch (error) {
        console.error(" OTP email sending failed:", error);
        return false;
    }
};
exports.Sendotpmail = Sendotpmail;
