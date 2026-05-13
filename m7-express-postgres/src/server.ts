import express, { type Application, type Request, type Response } from "express"
import {Pool} from "pg";
const app : Application = express()
const port = 3000
app.use(express.json()) // middleware

const pool = new Pool({
    connectionString : "postgresql://neondb_owner:npg_QyYf8Gh4FHul@ep-ancient-bonus-aqzqi6jj-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})

const initDB = async () =>{

    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(30),
                email VARCHAR(30) NOT NULL,
                password VARCHAR(30) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                age INT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
            
            `)
        console.log('DB connected!');
        
    } catch (error) {
        console.log(error);
        
    }

}

initDB()
app.get('/', (req : Request, res : Response) => {
  
    res.status(200).json({
        "message" : "Express Server",
        "author" : "Rafi Shariar"
    })
})

app.post('/', async (req : Request, res : Response)=>{
    console.log(req.body);
    
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
