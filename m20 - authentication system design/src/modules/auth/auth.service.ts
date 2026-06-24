import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface"

const loginUserFromDB = async (payload : ILoginUser) =>{
    const {email, password} = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where : {email}
    })

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if(!isPasswordMatched){
        throw new Error("password is incorrect");
    }

    return user;
}

export const authService = {loginUserFromDB}