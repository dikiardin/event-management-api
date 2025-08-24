"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    try {
        const tokens = req.headers.authorization?.split(" ")[1];
        if (!tokens) {
            throw { code: 401, message: "Unauthorized Token" };
        }
        const checkToken = (0, jsonwebtoken_1.verify)(tokens, "secret");
        res.locals.decrypt = checkToken;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=verifyToken.js.map