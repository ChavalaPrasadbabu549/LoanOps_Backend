import mongoose from "mongoose";

import dns from 'dns';

export default async function connectDB() {
    try {
        // Attempt to bypass local ISP/network SRV blocking by using Google DNS
        dns.setServers(['8.8.8.8', '8.8.4.4']);
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log("MongoDB Connected!");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

