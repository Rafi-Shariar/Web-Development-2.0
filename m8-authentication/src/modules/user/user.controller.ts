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


const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUserFromDB()

    res.status(200).json({
      success: true,
      message: "users retrived",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
}

const getSingleUser = async (req: Request, res: Response) => {
  const { id  } = req.params;
  try {
    
    const result = await userService.getSingleUserFromDB(id as string)

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "user not found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "users retrived",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
}

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, password, age, is_active } = req.body;

  try {
   
    const result = await userService.updateUserInDB(req.body, id as string)

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "user not found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "user updated",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
}


const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    
    const result = await userService.deleteUserFromDB(id as string)

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "user not found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "user deleted!",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
}


export const userController = {createUser, getUsers, getSingleUser, updateUser, deleteUser}