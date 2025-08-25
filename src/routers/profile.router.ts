import { Router } from "express";
import ProfileController from "../controllers/profile.controller";
import { verifyToken } from "../middleware/verifyToken";
import multer from "multer";

const upload = multer(); // memory storage
class ProfileRouter {
  private route: Router;
  private controller: ProfileController;

  constructor() {
    this.route = Router();
    this.controller = new ProfileController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.put("/update", verifyToken, this.controller.updateProfile);
    this.route.put(
      "/change-password",
      verifyToken,
      this.controller.changePassword
    );
    this.route.put(
      "/reset-password",
      verifyToken,
      this.controller.resetPassword
    );
    // POST untuk upload pertama kali profile image
    this.route.post(
      "/upload-profile-img",
      verifyToken,
      upload.single("profile_pic"),
      this.controller.uploadProfileImg
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default ProfileRouter;
