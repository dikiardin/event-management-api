import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

// Handle validation result
const validationHandle = (req: Request, res: Response, next: NextFunction) => {
  try {
    const errorValidation = validationResult(req);
    if (!errorValidation.isEmpty()) {
      return res.status(400).json({ errors: errorValidation.array() });
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Register validation
export const registerValidation = [
  body("email").notEmpty().isEmail().withMessage("Email is required"),
  body("password")
    .notEmpty()
    .isStrongPassword({
      minLength: 4,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage(
      "Password must contain uppercase, lowercase, number and minimum 4 characters"
    ),
  body("username").notEmpty().withMessage("Username is required"),
  body("role")
    .notEmpty()
    .isIn(["USER", "ADMIN", "ORGANIZER"])
    .withMessage("Role must be USER, ADMIN, or ORGANIZER"),
  validationHandle,
];

// Login validation
export const loginValidation = [
  body("email").notEmpty().isEmail().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validationHandle,
];
