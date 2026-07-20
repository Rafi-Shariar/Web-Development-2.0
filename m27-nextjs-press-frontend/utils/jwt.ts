import jwt from "jsonwebtoken";

const varifyToken = async (token: string, secrete: string) => {
  try {
    const varifiedToken = jwt.verify(token, secrete);
    return { success: true, data: varifiedToken };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const jwtUtils = { varifyToken };
