import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface"
import jwt, { SignOptions }  from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

const loginUserFromDB = async (payload : ILoginUser) =>{
    const {email, password} = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where : {email}
    })

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if(!isPasswordMatched){
        throw new Error("password is incorrect");
    }

    const jwtPayload = {
         id : user.id,
        name : user.name,
        email: user.email,
        role : user.role
    }

    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_screte, config.jwt_access_expires_in as SignOptions)
    const refreshToken = jwtUtils.createToken(jwtPayload, config.jwt_refresh_screte, config.jwt_refresh_expires_in as SignOptions)
    
    return {refreshToken, accessToken};
}

export const authService = {loginUserFromDB}