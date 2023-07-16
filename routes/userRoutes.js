import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();

//public Routes
router.get("/init", UserController.initUser);

router.post("/register", UserController.userRegistration);

//protected Routes

export default router;
