import { NextFunction, Request, Response } from "express";
declare class AuthController {
    register(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    verifyEmail(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    login(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    keepLogin(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    changeProfileImg(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default AuthController;
//# sourceMappingURL=auth.controller.d.ts.map