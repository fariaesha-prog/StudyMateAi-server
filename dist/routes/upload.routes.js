"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("../controllers/upload.controller");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
router.post('/image', upload_middleware_1.uploadImage.single('image'), upload_controller_1.UploadController.uploadImage);
exports.default = router;
