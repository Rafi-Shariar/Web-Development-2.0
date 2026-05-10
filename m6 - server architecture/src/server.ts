import { log } from "console";
import { createServer, IncomingMessage, Server, ServerResponse } from "http";

const server : Server = createServer(( req:IncomingMessage, res: ServerResponse)=>{
    // console.log(req.url);
    // console.log(req.method);

    const url = req.url;
    const method = req.method;

    if(url === '/' && method === 'GET'){
        res.writeHead(200,{"content-type" : "application/json"});
        res.end(JSON.stringify({message : " this is root route"}));
    }
    else if( url?.startsWith('/products')){
        
        res.writeHead(404,{"content-type" : "application/json"})
        res.end(JSON.stringify({message : "This is product Route"}));

    }
    else{
        res.writeHead(404,{"content-type" : "application/json"})
        res.end(JSON.stringify({message : " Route Not Found !"}));
    }
})

server.listen(5000, ()=>{ 
    console.log('Server is running on port 5000' );
    
})