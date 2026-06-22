import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";


const registerUserIntoDb = async(payload : RegisterUserPayload) =>{

    const {name,email,password,profilePhoto} = payload
    
    const isUserExists = await prisma.user.findUnique({
        where : {email}
    })

    if(isUserExists){
        throw new Error("User Already Exists with this email")
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))
    
    //creating user
    const createdUser = await prisma.user.create({
        data : {
            name,
            email,
            password : hashedPassword
        }
    })

    //creating profile for user
    await prisma.profile.create({
        data : {
            userId : createdUser.id,
            profilePhoto,

        }
    })

    const user = await prisma.user.findUnique({
        where : {
            id : createdUser.id,
            email : createdUser.email || email
        },
        omit : {
            password : true
        },
        include:{
            profile : true
        }
    })

    return user
}

export const userService = {registerUserIntoDb}