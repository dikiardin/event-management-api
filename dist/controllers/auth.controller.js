"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const createToken_1 = require("../utils/createToken");
const verifyToken_1 = require("../middleware/verifyToken");
const cloudinary_1 = require("../config/cloudinary");
const auth_service_1 = require("../service/auth.service");
const prisma = new prisma_1.PrismaClient();
class AuthController {
    async register(req, res, next) {
        try {
            await (0, auth_service_1.registerService)(req.body);
            return res.status(201).json({
                message: "User registered successfully. Please check your email to verify account.",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async verifyEmail(req, res, next) {
        try {
            const { token } = req.query;
            if (!token || typeof token !== "string") {
                return res.status(400).json({ message: "Token is required" });
            }
            const decoded = (0, verifyToken_1.verifyToken)(req, res, next);
            if (!decoded || !decoded.id) {
                return res
                    .status(400)
                    .json({ message: "Verification failed. Token invalid or expired." });
            }
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (user.is_verified) {
                return res.status(200).json({ message: "User already verified" });
            }
            await prisma.user.update({
                where: { id: decoded.id },
                data: { is_verified: true },
            });
            return res.status(200).json({ message: "Email verified successfully" });
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        const { email, password } = req.body;
        try {
            if (typeof email !== "string" || typeof password !== "string") {
                return res
                    .status(400)
                    .json({ error: "Email and password must be strings" });
            }
            const { token, user } = await (0, auth_service_1.loginService)(email, password);
            return res.status(200).json({
                message: "User signed in successfully",
                token,
                user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async keepLogin(req, res, next) {
        try {
            const signInUser = await prisma.user.findUnique({
                where: { id: parseInt(res.locals.decrypt.id) },
            });
            if (!signInUser) {
                return res.status(404).send({
                    success: false,
                    message: "Account not found",
                });
            }
            const newToken = (0, createToken_1.createToken)(signInUser, "24h");
            res.status(200).send({
                success: true,
                message: "Sign In successful",
                user: { email: signInUser.email, token: newToken },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async changeProfileImg(req, res, next) {
        try {
            if (!req.file) {
                throw { code: 404, message: "No Exist file" };
            }
            const upload = await (0, cloudinary_1.cloudinaryUpload)(req.file);
            const update = await prisma.user.update({
                where: { id: parseInt(res.locals.decrypt.id) },
                data: { profile_pic: upload.secure_url },
            });
            res
                .status(200)
                .send({ success: true, message: "Change Image profile success" });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map