import httpStatus from "http-status";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import jwt from "jsonwebtoken"
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";


const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await userService.registerUserIntoDb(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Register Successfull",
      data: {user} 
    });

  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    
  const profile = await userService.getMyProfileFromDB(req.user?.id as string)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Profile Retrived Successfully",
      data: {profile} 
    });

},)

const updateMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    
   const userId = req.user?.id as string;
   const payload = req.body;

   const updatedProfile = await userService.updateMyProfileIntoDB(userId, payload)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Profile updated successfully",
      data: {updatedProfile} 
    });

},)




export const userController = { registerUser, getMyProfile, updateMyProfile };
