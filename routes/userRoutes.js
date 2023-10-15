import express from "express";
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * this routes will verify
 * if valid token or not
 * to protected routes
 */
//route middlewares to validate token
router.use("/changepassword", checkUserAuth);
router.use("/loggedUser", checkUserAuth);

//public Routes

/**
 * this routes for test purpose
 * to verify if api is working.
 */
router.get("/init", UserController.initUser);
/**
 * this routes will use for
 * to register the user
 */
router.post("/register", UserController.userRegistration);
/**
 * this routes will use to
 * authenticate the user
 */
router.get("/signin", UserController.userLogin);

//protected Routes

/**
 * this routes will use to
 * change password of user
 * after login
 */
router.post("/changepassword", UserController.userChangePassword);

router.get("/loggedUser", UserController.loggedUser);

export default router;
