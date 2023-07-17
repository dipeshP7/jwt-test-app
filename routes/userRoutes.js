import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();

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

export default router;
