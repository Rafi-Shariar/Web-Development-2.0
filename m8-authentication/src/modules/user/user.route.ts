import { Router} from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router();


router.post("/", userController.createUser);

//get all users
router.get("/",auth(), userController.getUsers);

//get specific users
router.get("/:id", userController.getSingleUser);

//update user
router.put("/:id", userController.updateUser);

//delete user
router.delete("/:id", userController.deleteUser);


export const userRoute = router;