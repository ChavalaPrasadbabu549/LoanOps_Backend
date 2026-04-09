import { Request, Response } from 'express';
import User from '../models/user';
import { AuthenticatedRequest } from '../utils/@type';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
        expiresIn: '7d',
    });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, number, password } = req.body;
        // console.log(req.body);
        const image = (req as any).file ? (req as any).file.path : "";

        if (!name || !email || !number || !password) {
            res.status(400).json({ success: false, message: 'All fields including password are required' });
            return;
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
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
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error: any) {
        console.error('Error in register:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        console.log(req.body);

        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required' });
            return;
        }

        const user = await User.findOne({ email });

        if (!user || !user.password) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);

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
    } catch (error: any) {
        console.error('Error in login:', error);
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
