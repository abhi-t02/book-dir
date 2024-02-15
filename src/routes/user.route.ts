import { Router } from "express";

import { authToken } from "../middleware/auth.middleware";
import {
  getDeleteUserProfile,
  getUserProfile,
  resetUserPassword,
  userLogOut,
  userLogin,
  userLogoutAll,
  userProfileUpdate,
  userSignUp,
} from "../controller/user.controller";

const router = Router();

/**
 * POST /api/users/register
 * Register user
 */
router.post("/register", userSignUp);

/**
 * POST /api/users/login
 * Login user
 * response: token
 */
router.post("/login", userLogin);
router.get("/logout", <any>authToken, <any>userLogOut);
router.get("/logoutAll", <any>authToken, <any>userLogoutAll);

router.post("/reset-password", resetUserPassword);

router
  .route("/")
  .get(<any>authToken, <any>getUserProfile)
  .put(<any>authToken, <any>userProfileUpdate)
  .delete(<any>authToken, <any>getDeleteUserProfile);

export default router;
