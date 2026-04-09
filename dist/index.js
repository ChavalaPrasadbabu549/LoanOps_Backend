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
    "https://secureportalfrontend.netlify.app",
    "https://secureportalfrontend.netlify.app/",
    "https://loanops-backend.onrender.com",
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
server.listen(PORT, () => console.log(`Server running actively at: ${DOMAIN}`));
