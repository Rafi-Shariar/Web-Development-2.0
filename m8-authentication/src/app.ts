import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRouter } from "./modules/auth/auth.route";
import fs from "fs"
import logger from "./middleware/logger";


const app: Application = express();

// middleware
app.use(express.json());

app.use(logger)


app.use('/api/users', userRoute)

app.use('/api/profile', profileRoute)

app.use('/api/auth', authRouter)

export default app;
