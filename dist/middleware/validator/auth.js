"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
const validationHandle = (req, res, next) => {
    try {
        const errorValidation = (0, express_validator_1.validationResult)(req);
        if (!errorValidation.isEmpty()) {
            throw errorValidation.array();
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.registerValidation = [
    (0, express_validator_1.body)("email").notEmpty().isEmail().withMessage("Email is Required"),
    (0, express_validator_1.body)("password").notEmpty().isStrongPassword({
        minLength: 4,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
    }),
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    validationHandle,
];
exports.loginValidation = [
    (0, express_validator_1.body)("email").notEmpty().isEmail().withMessage("Email is required"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("password is required"),
    validationHandle,
];
//# sourceMappingURL=auth.js.map