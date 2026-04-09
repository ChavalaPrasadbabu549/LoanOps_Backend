import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { AuthenticatedRequest } from '../utils/@type';

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as jwt.JwtPayload;

      // Find user by ID
      const user = await User.findById(decoded.id).select('-otp -otpExpiry');

      if (!user) {
        res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Authentication Error:', error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};
