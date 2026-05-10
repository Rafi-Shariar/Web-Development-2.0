import path from "path";
import fs from 'fs';
const filePath = path.join(process.cwd(), "./src/database/db.json"); // combininting db path

export const readProduct = () =>{

    const product = fs.readFileSync(filePath, 'utf-8'); // reading data from db & making it string
    return JSON.parse(product);
    

}