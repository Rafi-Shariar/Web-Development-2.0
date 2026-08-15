import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { userServices } from "./user.service";

const uploadProfileImage = catchAsync(async (req: Request, res: Response) => {

    if(!req.file){
        throw new Error("No File Uploaded")
    }

    const userId = req.user?.userId

   const result =  await userServices.uploadProfileImage(req.file?.buffer, userId as string)
    

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Profile Image Changed Successfully.",
		data: result,
	});
});

export const userController = {
    uploadProfileImage
}