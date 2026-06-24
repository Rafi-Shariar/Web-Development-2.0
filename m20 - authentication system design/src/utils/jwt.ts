import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secrete: string,
  expiresIn: SignOptions,
) => {
  const token = jwt.sign(payload, secrete, {
    expiresIn,
  } as SignOptions);
  return token;
};

const varifyToken = (token : string, secrete : string) => {
  
  try {
    const varifiedToken = jwt.verify(token, secrete)
    return { success : true, data : varifiedToken};
  } catch (error : any) {
    return {
      success : false,
      error : error.message
    }
    
  }
  
}

export const jwtUtils = { createToken,varifyToken };
