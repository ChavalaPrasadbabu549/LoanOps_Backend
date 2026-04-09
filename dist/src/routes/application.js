"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const application_1 = require("../controllers/application");
const router = express_1.default.Router();
const fileUploads = upload_1.upload.fields([
    { name: 'panImage', maxCount: 1 },
    { name: 'aadhaarImage', maxCount: 1 },
    { name: 'documents', maxCount: 10 }
]);
router.post('/create', auth_1.protect, fileUploads, application_1.createApplication);
router.get('/all', auth_1.protect, application_1.getApplications);
router.get('/my-applications', auth_1.protect, application_1.getUserApplications);
router.route('/update/:id')
    .get(auth_1.protect, application_1.getApplicationById)
    .put(auth_1.protect, fileUploads, application_1.updateApplication);
router.patch('/update/:id/status', auth_1.protect, application_1.updateApplicationStatus);
exports.default = router;
