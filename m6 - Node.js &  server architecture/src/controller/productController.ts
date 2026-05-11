import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { parseBody } from "../utility/parseBody";
import { sendResponse } from "../utility/sendResponse";

export const productController = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const url = req.url;
  const method = req.method;
  const urlParts = url?.split("/");
  const id =
    urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null;

  if (url === "/products" && method === "GET") {
    // retrieve all products

    try {
      const product = readProduct();
      sendResponse(res, 200, true, "Product Retrived Successfully", product);
    } catch (error) {
      sendResponse(res, 404, false, "Something went wrong", error);
    }
  } else if (method === "GET" && id != null) {
    // retrieve a single product

    try {
      const products = readProduct();
      const product = products.find((p: IProduct) => p.id === id);

      if (!product) {
        return sendResponse(res, 404, false, "Product Not Found");
      }

      sendResponse(res, 200, true, "Product Retrived Successfully", product);
    } catch (error) {
      sendResponse(res, 404, false, "Something went wrong", error);
    }
  } else if (method === "POST" && url === "/products") {
    // create & add new product

    const products = readProduct();
    const body = await parseBody(req);
    const newProduct = {
      id: Date.now(),
      ...body,
    };
    // console.log(newProduct);
    products.push(newProduct);
    insertProduct(products);

    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "products created Successfully.",
        data: newProduct,
      }),
    );
  } else if (method === "PUT" && id !== null) {
    // update product
    const body = await parseBody(req);
    const products = readProduct();

    const index = products.findIndex((p: IProduct) => {
      return p.id === id;
    });

    if (index < 0) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "Product Not Found" }));
    }

    products[index] = {
      id: products[index].id,
      ...body,
    };

    insertProduct(products);

    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({ message: "Product Updated", data: products[index] }),
    );
  } else if (method === "DELETE" && id !== null) {
    const products = readProduct();
    const index = products.findIndex((p: IProduct) => p.id === id);

    if (index < 0) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "Product Not Found" }));
    }

    products.splice(index, 1);
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Product Deleted" }));
    insertProduct(products);
  }
};
