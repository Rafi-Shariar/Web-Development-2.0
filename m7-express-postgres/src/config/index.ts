import dotenv from "dotenv"
import path from 'path'
dotenv.config({
    path : path.join(process.cwd(), '.env')
})

const config = {
    conection_string : process.env.CONNECTIONSTRING as string,
}

export default config