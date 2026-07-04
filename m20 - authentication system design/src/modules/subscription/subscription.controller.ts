import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { subscriptionServices } from "./subscription.service"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status"
const createCheckOutSession = catchAsync(
    async(req : Request,res : Response,next : NextFunction) =>{
        const userId = req.user?.id
        const result = await subscriptionServices.createCheckOutSession(userId as string)

        sendResponse(res, {
            success : true,
            statusCode : httpStatus.OK,
            message : "Checkout completed successfully",
            data : result
        })
    }
)

const handleWebHook = catchAsync(
    async( req : Request, res : Response, next : NextFunction) =>{

        const event = req.body as Buffer;
        const signature = req.headers['stripe-signature']!;
        const result = await subscriptionServices.handleWebhook(event, signature as string)

        sendResponse(res, {
            success : true,
            statusCode : 200,
            message : "webhook triggered successfully",
            data : null
        })
    }
)

const getSubscriptionStatus = catchAsync(
    async( req : Request, res : Response, next : NextFunction) =>{

        const userId = req.user?.id
        const result = await subscriptionServices.getSubscriptionStatus(userId as string)

        sendResponse(res, {
            success : true,
            statusCode : httpStatus.OK,
            message : "Subscription retrived successfully",
            data : result
        })
    }
)


export const subscriptionController = {createCheckOutSession, handleWebHook, getSubscriptionStatus}