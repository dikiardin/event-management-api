import { NextFunction, Response, Request } from "express";
import { RoleType } from "../generated/prisma";

export const verifyRole = (allowedRoles: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = res.locals.decrypt.role as RoleType;

      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized to access this resource",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
