"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByEmail = exports.createAccount = void 0;
const prisma_1 = require("../config/prisma");
const createAccount = async (data) => {
    return await prisma_1.prisma.user.create({
        data,
    });
};
exports.createAccount = createAccount;
const findByEmail = async (email) => {
    return await prisma_1.prisma.user.findUnique({
        where: { email },
    });
};
exports.findByEmail = findByEmail;
//# sourceMappingURL=accounts.repository.js.map