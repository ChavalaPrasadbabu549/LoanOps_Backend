import connectDB from "./src/config/db";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import userRoutes from "./src/routes/user";
import applicationRoutes from "./src/routes/application";


dotenv.config();
connectDB();

const app = express();
const allowedOrigins = [
    "http://localhost:5173/",
    "http://localhost:5173",
    "https://applicationreviewsystem.netlify.app/",
    "https://applicationreviewsystem.netlify.app",

];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use("/applications", applicationRoutes);


const server = createServer(app);

const PORT = process.env.PORT || 5000;
const DOMAIN = process.env.DOMAIN || `http://localhost:${PORT}`;

// Global Error Handler to catch middleware (like Multer/Cloudinary) errors
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//     console.error("Global Error Caught:");
//     console.dir(err, { depth: null }); // safely prints [object Object] contents
//     res.status(500).json({
//         success: false,
//         message: err.message || "Cloudinary / Middleware Error (Check your .env keys!)",
//         error: err
//     });
// });

server.listen(PORT, () => console.log(`Server running actively at: ${DOMAIN}`));