"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_1 = require("../middleware/validator/auth");
const uploader_1 = require("../middleware/uploader");
const verifyToken_1 = require("../middleware/verifyToken");
class AuthRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.authController = new auth_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.post("/signup", auth_1.registerValidation, this.authController.register);
        this.route.post("/signin", auth_1.loginValidation, this.authController.login);
        this.route.get("/keep", this.authController.keepLogin);
        this.route.get("/verify", this.authController.verifyEmail);
        this.route.patch("/profile-img", verifyToken_1.verifyToken, (0, uploader_1.uploaderMemory)().single("img"), this.authController.changeProfileImg);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = AuthRouter;
//# sourceMappingURL=auth.router.js.map