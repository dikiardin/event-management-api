"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = exports.registerService = void 0;
const nodemailer_1 = require("../config/nodemailer");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createToken_1 = require("../utils/createToken");
const accounts_repository_1 = require("../repositories/accounts.repository");
const registerService = async (data) => {
    const { email, password, username } = data;
    // cek user existing
    const existingUser = await (0, accounts_repository_1.findByEmail)(email);
    if (existingUser) {
        throw new Error("Email already registered");
    }
    // hash password
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    // simpan user baru
    const user = await (0, accounts_repository_1.createAccount)({
        email,
        password: hashedPassword,
        username,
        isVerified: false,
    });
    // generate token
    const token = (0, createToken_1.createToken)({ id: user.id }, "1h");
    // link ke FE
    const link = `http://localhost:3000/verify?token=${token}`;
    // kirim email
    await nodemailer_1.transport.sendMail({
        to: email,
        subject: "Verify your account",
        html: `<a href="${link}" target="_blank"><div>Click here to verify</div></a>`,
    });
    return user;
};
exports.registerService = registerService;
const loginService = async (email, password) => {
    // cari user
    const user = await (0, accounts_repository_1.findByEmail)(email);
    if (!user) {
        throw new Error("Invalid email or password");
    }
    // cek password
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }
    // bikin token (24 jam)
    const token = (0, createToken_1.createToken)({ id: user.id }, "24h");
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
        },
    };
};
exports.loginService = loginService;
//# sourceMappingURL=auth.service.js.map