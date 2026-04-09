import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

// Configure Multer storage to upload straight to Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'loanops_profiles',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    } as any,
});

// Create Multer upload middleware
export const upload = multer({ storage: storage });
