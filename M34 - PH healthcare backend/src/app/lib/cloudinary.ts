import { v2 as cloudinary } from "cloudinary";
import config from "../config";

cloudinary.config({
    cloud_name : config.coudinary_cloud_name,
    api_key : config.coudinary_api_key,
    api_secret : config.coudinary_api_secrete
})

export const cloudinaryUpload = cloudinary