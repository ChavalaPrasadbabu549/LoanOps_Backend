import express from 'express';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';
import {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplication,
    updateApplicationStatus,
    getUserApplications,
    getDashboardStats
} from '../controllers/application';

const router = express.Router();
const fileUploads = upload.fields([
    { name: 'panImage', maxCount: 1 },
    { name: 'aadhaarImage', maxCount: 1 },
    { name: 'documents', maxCount: 10 },
    { name: 'voterId', maxCount: 1 },
    { name: 'bankStatement', maxCount: 1 },
    { name: 'houseTax', maxCount: 1 },
]);

router.post('/create', protect as express.RequestHandler, fileUploads as express.RequestHandler, createApplication as express.RequestHandler);

router.get('/all', protect as express.RequestHandler, getApplications as express.RequestHandler);
router.get('/my-applications', protect as express.RequestHandler, getUserApplications as express.RequestHandler);
router.get('/stats', protect as express.RequestHandler, getDashboardStats as express.RequestHandler);

router.route('/update/:id')
    .get(protect as express.RequestHandler, getApplicationById as express.RequestHandler)
    .put(protect as express.RequestHandler, fileUploads as express.RequestHandler, updateApplication as express.RequestHandler);

router.patch('/update/:id/status', protect as express.RequestHandler, updateApplicationStatus as express.RequestHandler);

export default router;
