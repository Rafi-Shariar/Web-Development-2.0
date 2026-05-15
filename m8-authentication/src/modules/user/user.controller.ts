import { Router, type Request, type Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";


// create a user & insert in table
const createUser = async (req: Request, res: Response) => {

  try {
    
    const result = await userService.createUserIntoDB(req.body)

    console.log(result);
    res.status(201).json({
      message: "user created",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
}

export const userController = {createUser}