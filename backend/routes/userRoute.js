import express from "express";
import { askToAssistant, getCurrentUser, updateAssistant } from "../controllers/userController.js";
import { isAuth } from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";

const userRouter = express.Router();


userRouter.get('/current', isAuth, getCurrentUser)
userRouter.post("/update",isAuth, upload.single("assistantImage"),updateAssistant)
userRouter.post("/askToAssistant",isAuth, askToAssistant)


export default userRouter