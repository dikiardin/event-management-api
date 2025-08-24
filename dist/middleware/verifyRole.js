"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthor = void 0;
const verifyAuthor = (req, res, next) => {
    try {
        const userRole = res.locals.decrypt.role?.toLowerCase();
        if (userRole !== "author" && userRole !== "admin") {
            throw { code: 401, message: "You are not authorized to write blogs" };
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.verifyAuthor = verifyAuthor;
//# sourceMappingURL=verifyRole.js.map