import express from 'express';
import {
    registerUser,
    requestOTP,
    verifyOTP,
    updateProfile,
} from '../controllers/user';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.post('/register', upload.single('profile'), registerUser);
router.post('/login', requestOTP);
router.post('/verify-otp', verifyOTP);
router.put('/update', protect as express.RequestHandler, upload.single('profile') as express.RequestHandler, updateProfile as express.RequestHandler);

export default router;
