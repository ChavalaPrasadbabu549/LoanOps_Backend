"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// console.log('Cloudinary Config Check:', {
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY ? 'present' : 'missing',
//     api_secret: process.env.CLOUDINARY_API_SECRET ? 'present' : 'missing'
// });
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// async function testCloudinary() {
//     try {
//         const result = await cloudinary.uploader.upload("https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png", {
//             folder: "test_purpose",
//             public_id: "test_image"
//         });
//         console.log("Cloudinary Test Success:", result);
//         console.log("Cloudinary URL:", result.secure_url);
//     } catch (error) {
//         console.error("Cloudinary Test Failed:", error);
//     }
// }
// testCloudinary();
exports.default = cloudinary_1.v2;
