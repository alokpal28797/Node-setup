import { Router } from "express";
import { loginUser, logout, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post('/register', upload.fields([
    { name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }
]), registerUser)

userRouter.post('/login', loginUser)


userRouter.post('/logout', verifyJWT, logout)

export default userRouter