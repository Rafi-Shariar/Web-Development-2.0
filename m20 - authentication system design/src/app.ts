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

app.use("/api/subscription/webhook",express.raw({type : 'application/json'}), (request, response) => {
  let event = request.body;
//   console.log(event, "Stripe Request body");
//   console.log(request.headers, "Stripe Request Headers");
  

  if (endpointSecret) {
    
    const signature = request.headers['stripe-signature']!;
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature, 
        endpointSecret
      );
    } catch (err : any) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  console.log(event, "Event After Try Block");
  

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
  
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
    
      break;
    default:
      
      console.log(`Unhandled event type ${event.type}.`);
  }
})


app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


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
app.use("/api/subscription", subscriptionRoutes)


app.use(notFound)
app.use(globalErrorHandler)
export default app;