import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";


const applyAsDoctor = catchAsync(async (req: Request, res: Response) => {

	const files = req.files as { [fieldname : string] : Express.Multer.File[]}


	const resume = files?.['resume'] ? files['resume'][0] : null
	const additionalFiles = files?.['additionalFiles'] ? files['additionalFiles'] : []
	const data = req.body

	
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Apply as doctor successfully",
		data: null,
	});
});

export const DoctorController = {
    applyAsDoctor
}