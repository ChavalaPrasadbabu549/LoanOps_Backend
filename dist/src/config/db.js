"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const dns_1 = __importDefault(require("dns"));
async function connectDB() {
    try {
        dns_1.default.setServers(['8.8.8.8', '8.8.4.4']);
        await mongoose_1.default.connect(process.env.MONGO_URL);
        console.log("MongoDB Connected!");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
;
