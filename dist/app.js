"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const resource_routes_1 = __importDefault(require("./routes/resource.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const quiz_routes_1 = __importDefault(require("./routes/quiz.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const planner_routes_1 = __importDefault(require("./routes/planner.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
// API Routes — all under /api/v1
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/upload', upload_routes_1.default);
app.use('/api/v1/resources', resource_routes_1.default);
// Global Error Handler — must be last, after all routes
app.use(error_middleware_1.errorHandler);
app.use('/api/v1/users', user_routes_1.default);
app.use('/api/v1/ai', ai_routes_1.default);
app.use('/api/v1/chat', chat_routes_1.default);
app.use('/api/v1/quiz', quiz_routes_1.default);
app.use('/api/v1/dashboard', dashboard_routes_1.default);
app.use('/api/v1/planner', planner_routes_1.default);
exports.default = app;
