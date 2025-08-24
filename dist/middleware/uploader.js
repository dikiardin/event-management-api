"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploaderMemory = void 0;
const multer_1 = __importDefault(require("multer"));
const uploaderMemory = () => {
    return (0, multer_1.default)({
        storage: multer_1.default.memoryStorage(),
        limits: { fileSize: 1 * 1024 * 1024 },
    });
};
exports.uploaderMemory = uploaderMemory;
//# sourceMappingURL=uploader.js.map