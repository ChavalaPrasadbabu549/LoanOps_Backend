"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserApplications = exports.updateApplicationStatus = exports.updateApplication = exports.getApplicationById = exports.getApplications = exports.createApplication = void 0;
const application_1 = __importDefault(require("../models/application"));
const getUploadedFileUrl = (files, fieldName) => {
    if (files && files[fieldName] && files[fieldName].length > 0) {
        return files[fieldName][0].path;
    }
    return undefined;
};
const getUploadedFilesUrls = (files, fieldName) => {
    if (files && files[fieldName]) {
        return files[fieldName].map((file) => file.path);
    }
    return [];
};
const createApplication = async (req, res) => {
    try {
        const { applicantName, mobileNumber, panNumber, aadhaarNumber } = req.body;
        let panImage = "";
        let aadhaarImage = "";
        let documents = [];
        if (req.files) {
            panImage = getUploadedFileUrl(req.files, 'panImage') || "";
            aadhaarImage = getUploadedFileUrl(req.files, 'aadhaarImage') || "";
            documents = getUploadedFilesUrls(req.files, 'documents');
        }
        // Generate simple unique application number
        const applicationNumber = `APP-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
        const application = await application_1.default.create({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createApplication = createApplication;
const getApplications = async (req, res) => {
    try {
        const applications = await application_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: applications });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getApplications = getApplications;
const getApplicationById = async (req, res) => {
    try {
        const application = await application_1.default.findById(req.params.id);
        if (!application) {
            res.status(404).json({ success: false, message: "Application not found" });
            return;
        }
        res.status(200).json({ success: true, data: application });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getApplicationById = getApplicationById;
const updateApplication = async (req, res) => {
    try {
        const { applicantName, mobileNumber, panNumber, aadhaarNumber } = req.body;
        const application = await application_1.default.findById(req.params.id);
        if (!application) {
            res.status(404).json({ success: false, message: "Application not found" });
            return;
        }
        application.applicantName = applicantName || application.applicantName;
        application.mobileNumber = mobileNumber || application.mobileNumber;
        application.panNumber = panNumber || application.panNumber;
        application.aadhaarNumber = aadhaarNumber || application.aadhaarNumber;
        if (req.files) {
            const panImage = getUploadedFileUrl(req.files, 'panImage');
            const aadhaarImage = getUploadedFileUrl(req.files, 'aadhaarImage');
            const documents = getUploadedFilesUrls(req.files, 'documents');
            if (panImage)
                application.panImage = panImage;
            if (aadhaarImage)
                application.aadhaarImage = aadhaarImage;
            if (documents.length > 0) {
                application.documents = [...application.documents, ...documents];
            }
        }
        await application.save();
        res.status(200).json({ success: true, data: application });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateApplication = updateApplication;
const updateApplicationStatus = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        const application = await application_1.default.findById(req.params.id);
        if (!application) {
            res.status(404).json({ success: false, message: "Application not found" });
            return;
        }
        if (['Pending', 'Approved', 'Rejected'].includes(status)) {
            application.status = status;
        }
        if (status === 'Rejected' && rejectionReason) {
            application.rejectionReason = rejectionReason;
        }
        else if (status === 'Approved') {
            application.rejectionReason = undefined;
        }
        await application.save();
        res.status(200).json({ success: true, data: application });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
const getUserApplications = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }
        const applications = await application_1.default.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: applications });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getUserApplications = getUserApplications;
