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

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
  const {accessToken} = req.cookies;
  const varifiedToken = jwtUtils.varifyToken(accessToken, config.jwt_access_screte);

  if(typeof varifiedToken === "string") throw new Error(varifiedToken)

  const profile = await userService.getMyProfileFromDB(varifiedToken.id )

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Register Successfull",
      data: {profile} 
    });

  },)
export const userController = { registerUser, getMyProfile };
