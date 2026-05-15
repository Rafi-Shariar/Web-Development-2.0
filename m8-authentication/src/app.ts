import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { initDB, pool } from "./db";
import { userRoute } from "./modules/user/user.route";
const app: Application = express();

app.use(express.json()); // middleware


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Express Server",
    author: "Rafi Shariar",
  });
});

app.use('/api/users', userRoute)










export default app;
