"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("@/app"));
const environment_1 = __importDefault(require("@/config/environment"));
const database_1 = require("@/config/database");
const startServer = async () => {
    await (0, database_1.connectDatabase)();
    app_1.default.listen(environment_1.default.PORT, () => {
        console.log(`Server running on port ${environment_1.default.PORT}`);
    });
};
startServer().catch((error) => {
    console.error('Server failed to start:', error);
    process.exit(1);
});
