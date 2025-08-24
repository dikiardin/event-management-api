"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const createToken = (account, expiresIn) => {
    return (0, jsonwebtoken_1.sign)({
        id: account.id,
        role: account.role,
    }, "secret", {
        expiresIn,
    });
};
exports.createToken = createToken;
//# sourceMappingURL=createToken.js.map