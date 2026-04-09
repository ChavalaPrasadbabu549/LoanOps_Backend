import { Response } from 'express';
import Application from '../models/application';
import { AuthenticatedRequest } from '../utils/@type';


const getUploadedFileUrl = (files: any, fieldName: string): string | undefined => {
    if (files && files[fieldName] && files[fieldName].length > 0) {
        return files[fieldName][0].path;
    }
    return undefined;
};

const getUploadedFilesUrls = (files: any, fieldName: string): string[] => {
    if (files && files[fieldName]) {
        return files[fieldName].map((file: any) => file.path);
    }
    return [];
};

export const createApplication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { applicantName, mobileNumber, panNumber, aadhaarNumber } = req.body;

        let panImage = "";
        let aadhaarImage = "";
        let documents: string[] = [];

        if ((req as any).files) {
            panImage = getUploadedFileUrl((req as any).files, 'panImage') || "";
            aadhaarImage = getUploadedFileUrl((req as any).files, 'aadhaarImage') || "";
            documents = getUploadedFilesUrls((req as any).files, 'documents');
        }

        // Generate simple unique application number
        const applicationNumber = `APP-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

        const application = await Application.create({
            userId: req.user?._id,
            applicantName,
            mobileNumber,
            panNumber,
            panImage,
            aadhaarNumber,
            aadhaarImage,
            documents,
            applicationNumber,
            status: "Pending"
        });

        res.status(201).json({ success: true, data: application });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getApplications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const applications = await Application.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: applications });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getApplicationById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            res.status(404).json({ success: false, message: "Application not found" });
            return;
        }
        res.status(200).json({ success: true, data: application });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};



export const updateApplication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { applicantName, mobileNumber, panNumber, aadhaarNumber } = req.body;

        const application = await Application.findById(req.params.id);
        if (!application) {
            res.status(404).json({ success: false, message: "Application not found" });
            return;
        }

        application.applicantName = applicantName || application.applicantName;
        application.mobileNumber = mobileNumber || application.mobileNumber;
        application.panNumber = panNumber || application.panNumber;
        application.aadhaarNumber = aadhaarNumber || application.aadhaarNumber;


        if ((req as any).files) {
            const panImage = getUploadedFileUrl((req as any).files, 'panImage');
            const aadhaarImage = getUploadedFileUrl((req as any).files, 'aadhaarImage');
            const documents = getUploadedFilesUrls((req as any).files, 'documents');

            if (panImage) application.panImage = panImage;
            if (aadhaarImage) application.aadhaarImage = aadhaarImage;
            if (documents.length > 0) {
                application.documents = [...application.documents, ...documents];
            }
        }

        await application.save();
        res.status(200).json({ success: true, data: application });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateApplicationStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { status, rejectionReason } = req.body;

        const application = await Application.findById(req.params.id);
        if (!application) {
            res.status(404).json({ success: false, message: "Application not found" });
            return;
        }

        if (['Pending', 'Approved', 'Rejected'].includes(status)) {
            application.status = status;
        }

        if (status === 'Rejected' && rejectionReason) {
            application.rejectionReason = rejectionReason;
        } else if (status === 'Approved') {
            application.rejectionReason = undefined;
        }

        await application.save();
        res.status(200).json({ success: true, data: application });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserApplications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }

        const applications = await Application.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: applications });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
