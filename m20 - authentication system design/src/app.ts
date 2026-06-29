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

const app : Application = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin:config.app_url,
    credentials:true
}))

app.get("/", async (req : Request,res : Response)=>{

    // const user = await prisma.user.findMany();
    // console.log(user);
    
    res.send("Hello")
})

//user routes
app.use("/api/users", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/posts", postRoute)
app.use("/api/comments", commentRoutes)


app.use(notFound)
app.use(globalErrorHandler)
export default app;