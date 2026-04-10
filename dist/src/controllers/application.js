"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.getUserApplications = exports.updateApplicationStatus = exports.updateApplication = exports.getApplicationById = exports.getApplications = exports.createApplication = void 0;
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
        if (!req.user) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }
        const { applicantName, mobileNumber, panNumber, aadhaarNumber, loanAmount, loanType, purpose, address, remarks } = req.body;
        // Check for duplicate applications (PAN or Aadhaar)
        const existingApplication = await application_1.default.findOne({
            $or: [{ panNumber }, { aadhaarNumber }],
            status: { $ne: 'Rejected' }
        });
        if (existingApplication) {
            res.status(400).json({
                success: false,
                message: 'An application with this PAN or Aadhaar number already exists and is currently in process.'
            });
            return;
        }
        if (!applicantName || !mobileNumber || !panNumber || !aadhaarNumber || !loanAmount || !loanType || !address) {
            res.status(400).json({ success: false, message: 'Please provide all required applicant and loan details' });
            return;
        }
        let panImage = "";
        let aadhaarImage = "";
        let voterId = "";
        let bankStatement = "";
        let houseTax = "";
        let documents = [];
        if (req.files) {
            const files = req.files;
            panImage = getUploadedFileUrl(files, 'panImage') || "";
            aadhaarImage = getUploadedFileUrl(files, 'aadhaarImage') || "";
            voterId = getUploadedFileUrl(files, 'voterId') || "";
            bankStatement = getUploadedFileUrl(files, 'bankStatement') || "";
            houseTax = getUploadedFileUrl(files, 'houseTax') || "";
            documents = getUploadedFilesUrls(files, 'documents');
        }
        if (!voterId || !bankStatement || !houseTax) {
            res.status(400).json({ success: false, message: 'Please upload all mandatory documents (Voter ID, Bank Statement, House Tax)' });
            return;
        }
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
            loanAmount,
            loanType,
            purpose,
            address,
            remarks,
            voterId,
            bankStatement,
            houseTax,
            status: "Pending"
        });
        res.status(201).json({ success: true, data: application, message: "Application created successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createApplication = createApplication;
const getApplications = async (req, res) => {
    try {
        const { page = 1, limit = 10, applicantName, mobileNumber, applicationNumber, status, loanType, aadhaarNumber, panNumber, } = req.query;
        const filter = {};
        if (applicantName)
            filter.applicantName = { $regex: applicantName, $options: 'i' };
        if (mobileNumber)
            filter.mobileNumber = { $regex: mobileNumber, $options: 'i' };
        if (applicationNumber)
            filter.applicationNumber = applicationNumber;
        if (status)
            filter.status = status;
        if (loanType)
            filter.loanType = loanType;
        if (aadhaarNumber)
            filter.aadhaarNumber = aadhaarNumber;
        if (panNumber)
            filter.panNumber = panNumber;
        const skip = (Number(page) - 1) * Number(limit);
        const [applications, total] = await Promise.all([
            application_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            application_1.default.countDocuments(filter)
        ]);
        res.status(200).json({
            success: true,
            data: applications,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit))
            },
            message: "Applications fetched successfully"
        });
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
        res.status(200).json({ success: true, data: application, message: "Application fetched successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getApplicationById = getApplicationById;
const updateApplication = async (req, res) => {
    try {
        const { applicantName, mobileNumber, panNumber, aadhaarNumber, loanAmount, loanType, purpose, address, remarks, voterId, bankStatement, houseTax } = req.body;
        const application = await application_1.default.findById(req.params.id);
        if (!application) {
            res.status(404).json({ success: false, message: "Application not found" });
            return;
        }
        application.applicantName = applicantName || application.applicantName;
        application.mobileNumber = mobileNumber || application.mobileNumber;
        application.panNumber = panNumber || application.panNumber;
        application.aadhaarNumber = aadhaarNumber || application.aadhaarNumber;
        application.loanAmount = loanAmount || application.loanAmount;
        application.loanType = loanType || application.loanType;
        application.purpose = purpose || application.purpose;
        application.address = address || application.address;
        application.remarks = remarks || application.remarks;
        application.voterId = voterId || application.voterId;
        application.bankStatement = bankStatement || application.bankStatement;
        application.houseTax = houseTax || application.houseTax;
        if (req.files) {
            const files = req.files;
            const panImage = getUploadedFileUrl(files, 'panImage');
            const aadhaarImage = getUploadedFileUrl(files, 'aadhaarImage');
            const voterId = getUploadedFileUrl(files, 'voterId');
            const bankStatement = getUploadedFileUrl(files, 'bankStatement');
            const houseTax = getUploadedFileUrl(files, 'houseTax');
            const documents = getUploadedFilesUrls(files, 'documents');
            if (panImage)
                application.panImage = panImage;
            if (aadhaarImage)
                application.aadhaarImage = aadhaarImage;
            if (voterId)
                application.voterId = voterId;
            if (bankStatement)
                application.bankStatement = bankStatement;
            if (houseTax)
                application.houseTax = houseTax;
            if (documents.length > 0) {
                application.documents = [...application.documents, ...documents];
            }
        }
        await application.save();
        res.status(200).json({ success: true, data: application, message: "Application updated successfully" });
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
        res.status(200).json({ success: true, data: application, message: "Application status updated successfully" });
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
        const { page = 1, limit = 10, applicationNumber, aadhaarNumber, panNumber, applicantName, mobileNumber, loanAmount, status, loanType } = req.query;
        // Construct filter object scoped to current user
        const filter = { userId: req.user._id };
        if (applicationNumber)
            filter.applicationNumber = applicationNumber;
        if (status)
            filter.status = status;
        if (loanType)
            filter.loanType = loanType;
        if (aadhaarNumber)
            filter.aadhaarNumber = aadhaarNumber;
        if (panNumber)
            filter.panNumber = panNumber;
        if (applicantName)
            filter.applicantName = { $regex: applicantName, $options: 'i' };
        if (mobileNumber)
            filter.mobileNumber = { $regex: mobileNumber, $options: 'i' };
        if (loanAmount)
            filter.loanAmount = loanAmount;
        const skip = (Number(page) - 1) * Number(limit);
        const [applications, total] = await Promise.all([
            application_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            application_1.default.countDocuments(filter)
        ]);
        res.status(200).json({
            success: true,
            data: applications,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit))
            },
            message: "My applications fetched successfully"
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getUserApplications = getUserApplications;
const getDashboardStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const filter = { userId: req.user?._id };
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate)
                filter.createdAt.$gte = new Date(startDate);
            if (endDate)
                filter.createdAt.$lte = new Date(endDate);
        }
        // 1. Get Status Count Stats
        const stats = await application_1.default.aggregate([
            { $match: filter },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        const counts = { Total: 0, Approved: 0, Rejected: 0, Pending: 0 };
        stats.forEach((s) => {
            if (s._id === 'Approved')
                counts.Approved = s.count;
            if (s._id === 'Rejected')
                counts.Rejected = s.count;
            if (s._id === 'Pending')
                counts.Pending = s.count;
            counts.Total += s.count;
        });
        // 2. Linear Growth Trends (Monthly)
        const growthTrends = await application_1.default.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);
        res.status(200).json({
            success: true,
            data: {
                counts,
                growthTrends,
                statusDistribution: stats
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getDashboardStats = getDashboardStats;
