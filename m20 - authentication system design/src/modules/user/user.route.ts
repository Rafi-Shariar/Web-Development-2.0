import {Router } from "express";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";


const router = Router();


//register user
router.post("/register", userController.registerUser);

//get user profile
router.get("/me", auth(Role.ADMIN, Role.AUTHOR, Role.USER), userController.getMyProfile);

//update user profile
router.put("/my-profile", auth(Role.ADMIN, Role.AUTHOR, Role.USER), userController.updateMyProfile)
export const userRouter = router;
 