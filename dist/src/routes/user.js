"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.post('/register', upload_1.upload.single('profile'), user_1.registerUser);
router.post('/login', user_1.loginUser);
router.put('/update', auth_1.protect, upload_1.upload.single('profile'), user_1.updateProfile);
exports.default = router;
