import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
const app: Application = express();
const port = 3000;
app.use(express.json()); // middleware

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_QyYf8Gh4FHul@ep-ancient-bonus-aqzqi6jj-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const initDB = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(30),
                email VARCHAR(30) UNIQUE NOT NULL,
                password VARCHAR(30) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                age INT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
            
            `);
    console.log("DB connected!");
  } catch (error) {
    console.log(error);
  }
};

initDB();
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Express Server",
    author: "Rafi Shariar",
  });
});

// create a user & insert in table
app.post("/api/users", async (req: Request, res: Response) => {
  const { name, email, password, age } = req.body;

  try {
    const result = await pool.query(
      `
            INSERT INTO users(name,email,password,age) VALUES ($1,$2,$3,$4)
            RETURNING *
        `,
      [name, email, password, age],
    );

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
});

//get all users
app.get('/api/users', async(req : Request, res : Response) =>{

    try {

        const result = await pool.query(`
                SELECT * FROM users
            `)
        
        res.status(200).json({
            success : true,
            message : "users retrived",
            data : result.rows
        })
        
    } catch (error : any) {
         res.status(500).json({
            success : false,
            message : error.message,
            error : error
        })
    }

})

//get specific users
app.get('/api/users/:id', async(req : Request, res : Response) =>{
    
    const {id} = req.params;
    try {

        const result = await pool.query(`
                SELECT * FROM users WHERE id=$1
            `, [id])
        
        if(result.rows.length === 0 ){
            return res.status(500).json({
            success : false,
            message : "user not found",
            data : {}
        })

        }

        res.status(200).json({
            success : true,
            message : "users retrived",
            data : result.rows[0]
        })
        
    } catch (error : any) {
         res.status(500).json({
            success : false,
            message : error.message,
            error : error
        })
    }

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
