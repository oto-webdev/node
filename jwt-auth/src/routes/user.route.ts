import express from "express";
import { loginUser, logOutUser, registerAdmin, registerUser } from "../controllers/user.controller";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logOutUser);
router.post("/register-admin", registerAdmin);

export default router;