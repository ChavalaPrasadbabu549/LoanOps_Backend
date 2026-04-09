import express from 'express';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';
import {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplication,
    updateApplicationStatus
} from '../controllers/application';

const router = express.Router();

const fileUploads = upload.fields([
    { name: 'panImage', maxCount: 1 },
    { name: 'aadhaarImage', maxCount: 1 },
    { name: 'documents', maxCount: 10 }
]);

router.route('/create')
    .post(protect as express.RequestHandler, fileUploads as express.RequestHandler, createApplication as express.RequestHandler)
    .get(protect as express.RequestHandler, getApplications as express.RequestHandler);

router.route('/update/:id')
    .get(protect as express.RequestHandler, getApplicationById as express.RequestHandler)
    .put(protect as express.RequestHandler, fileUploads as express.RequestHandler, updateApplication as express.RequestHandler);

router.patch('/update/:id/status', protect as express.RequestHandler, updateApplicationStatus as express.RequestHandler);

export default router;
