import express from 'express';
import {
    registerUser,
    loginUser,
    updateProfile,
    getuserdetails
} from '../controllers/user';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.post('/register', upload.single('profile'), registerUser);
router.post('/login', upload.none() as express.RequestHandler, loginUser as express.RequestHandler);
router.put('/update', protect as express.RequestHandler, upload.single('profile') as express.RequestHandler, updateProfile as express.RequestHandler);
router.get('/userdetails', protect as express.RequestHandler, getuserdetails as express.RequestHandler);

export default router;
