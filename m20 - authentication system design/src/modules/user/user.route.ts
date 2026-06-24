import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";

const router = Router();

declare global {
  namespace Express {
    interface Request {
      user?: {
        name: string;
        email: string;
        id: string;
        role: Role;
      };
    }
  }
}

router.post("/register", userController.registerUser);

const auth = (...requiredRoles : Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies.accessToken 
    //   || req.headers.authorization?.startsWith("Bearer")
    //     ? req.headers.authorization?.split(" ")[1]
    //     : req.headers.authorization;

        if(!token) throw new Error("you are not logged in. Please log in to access")
        
    const verifiedToken = jwtUtils.varifyToken(token, config.jwt_access_screte)

    if(!verifiedToken.success){
        throw new Error(verifiedToken.error)
    }

    const {email, name, id, role } = verifiedToken.data as JwtPayload;

    if(requiredRoles.length && !requiredRoles.includes(role)){
        throw new Error("Forbidden. You don't have permission")
    }

    const user = await prisma.user.findUnique({
        where : { id, email, name, role}
    })

    if(!user) throw new Error("User not found")

    if(user.activeStatus === "BLOCKED"){
        throw new Error("Your account has been blocked. Please contact support")
    }

    req.user = {email, name, id, role}

    next();
  });
};
router.get("/me", auth(Role.ADMIN, Role.AUTHOR, Role.USER), userController.getMyProfile);

export const userRouter = router;
