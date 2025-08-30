import { verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

// Helper khusus service
export const decodeToken = (token: string) => {
  return verify(token, "secret"); // hasil return bisa langsung dipakai di service
};

// Middleware untuk route
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader);

    const tokens = authHeader?.split(" ")[1];
    console.log("Extracted Token:", tokens);

    if (!tokens) {
      throw { code: 401, message: "Unauthorized Token" };
    }

    const checkToken = decodeToken(tokens);
    console.log("Decoded Token:", checkToken);

    res.locals.decrypt = checkToken;
    next();
  } catch (error: any) {
    console.log("Verify Token Error:", error);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    next(error);
  }
};
