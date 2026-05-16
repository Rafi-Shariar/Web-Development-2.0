import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRouter } from "./modules/auth/auth.route";
const app: Application = express();

app.use(express.json()); // middleware


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Express Server",
    author: "Rafi Shariar",
  });
});

app.use('/api/users', userRoute)

app.use('/api/profile', profileRoute)

app.use('/api/auth', authRouter)

export default app;
