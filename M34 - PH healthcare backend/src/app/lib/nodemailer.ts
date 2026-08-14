import config from "../config"
import nodemailer from "nodemailer"
export const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : config.smpt_user,
        pass : config.smpt_password
    }
})
