"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = void 0;
const bcryptjs_1 = require("bcryptjs");
const comparePassword = async (plainPassword, hashedPassword) => {
    return await (0, bcryptjs_1.compare)(plainPassword, hashedPassword);
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=comparePassword.js.map