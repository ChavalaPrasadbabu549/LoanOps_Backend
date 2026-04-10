"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./src/config/db"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const user_1 = __importDefault(require("./src/routes/user"));
const application_1 = __importDefault(require("./src/routes/application"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
const allowedOrigins = [
    "http://localhost:5173/",
    "http://localhost:5173",
    "https://applicationreviewsystem.netlify.app/",
    "https://applicationreviewsystem.netlify.app",
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/user", user_1.default);
app.use("/applications", application_1.default);
const server = (0, http_1.createServer)(app);
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
