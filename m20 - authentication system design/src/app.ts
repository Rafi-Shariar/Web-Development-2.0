import cookieParser from "cookie-parser";
import express, { application, Application, NextFunction, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.route";
import { postRoute } from "./modules/post/post.route";
import { commentRoutes } from "./modules/commets/comment.route";
import { notFound } from "./middlewares/notFound";
import httpStatus from "http-status";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { stripe } from "./lib/stripe";
import { subscriptionRoutes } from "./modules/subscription/subscription.route";

const app : Application = express()
app.use(cors({
    origin:config.app_url,
    credentials:true
}))

const endpointSecret = config.webhook_secrete;

app.use("/api/subscription/webhook", express.raw({type : 'application/json'}))

 
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.get("/", async (req : Request,res : Response)=>{    
    res.send("Hello")
})

//user routes
app.use("/api/users", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/posts", postRoute)
app.use("/api/comments", commentRoutes)
app.use("/api/subscription", subscriptionRoutes)


app.use(notFound)
app.use(globalErrorHandler)
export default app;