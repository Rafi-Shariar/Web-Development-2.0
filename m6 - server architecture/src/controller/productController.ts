import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { parseBody } from "../utility/parseBody";

export const productController = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const url = req.url;
  const method = req.method;
  const urlParts = url?.split('/');
  const id = urlParts && urlParts[1] === 'products' ? Number(urlParts[2]) : null;
  
  
  

  if (url === "/products" && method === "GET") { // retrieve all products

    const product = readProduct();
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "products Retrived Successfully.", data : product   }));
  }
  else if( method === 'GET' && id != null){ // retrieve a single product

     const products = readProduct();
     const product = products.find((p : IProduct)=> p.id === id)
    
     res.writeHead(200, { "content-type": "application/json" });
     res.end(JSON.stringify({ message: "products Retrived Successfully.", data : product   }));

     
  }
  else if(method === 'POST' && url === '/products'){
    
    const products = readProduct();
    const body = await parseBody(req);
    const newProduct = {
      id : Date.now(),
      ...body
    }
    // console.log(newProduct);
    products.push(newProduct)
    insertProduct(products)
    
    
     res.writeHead(200, { "content-type": "application/json" });
     res.end(JSON.stringify({ message: "products created Successfully.", data : newProduct}));

  }
};
