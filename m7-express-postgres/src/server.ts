import express, { type Application, type Request, type Response } from "express"
import {Pool} from "pg";
const app : Application = express()
const port = 3000
app.use(express.json()) // middleware

const pool = new Pool({
    connectionString : "postgresql://neondb_owner:npg_QyYf8Gh4FHul@ep-ancient-bonus-aqzqi6jj-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})

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
