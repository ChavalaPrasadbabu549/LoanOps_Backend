import { Request, Response } from 'express';
import User from '../models/user';
import { generateOTP, setOtp, verifyOtp } from '../utils/otp';
import { Sendotpmail } from '../utils/email';
import { AuthenticatedRequest } from '../utils/@type';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
        expiresIn: '7d',
    });
};


export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, number } = req.body;
        const image = (req as any).file ? (req as any).file.path : "";

        if (!name || !email || !number) {
            res.status(400).json({ success: false, message: 'All fields are required' });
            return;
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }

        const user = await User.create({
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
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error: any) {
        console.error('Error in register:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

export const requestOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ success: false, message: 'Email is required' });
            return;
        }

        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ success: false, message: 'User not found, please register first' });
            return;
        }

        const otp = generateOTP(6);

        setOtp(email, otp, user);

        await Sendotpmail(user.email, otp);

        res.status(200).json({
            success: true,
            message: 'OTP sent to email successfully',
        });
    } catch (error: any) {
        console.error('Error in requestOTP:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            res.status(400).json({ success: false, message: 'Email and OTP are required' });
            return;
        }

        const verifiedData = verifyOtp(email, otp);

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
    } catch (error: any) {
        console.error('Error in verifyOTP:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { name, number, profile } = req.body;
        const image = (req as any).file ? (req as any).file.path : undefined;

        if (!req.user) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }

        const user = await User.findById(req.user._id);

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
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error: any) {
        console.error('Error in updateProfile:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
