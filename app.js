const restify= require("restify");
const routes = require('./router/router.js');
const path=require("path")
// const paths=require('./frontend/')
const corsMiddleware = require('restify-cors-middleware')
 
const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['authorization','Content-Type'],
})
const server=restify.createServer()
require("dotenv").config()
const port=process.env.port
server.use(restify.plugins.bodyParser());
// server.get("/*",restify.plugins.serveStatic({
//     directory:path.join(__dirname,'./frontend'),
//     default:'index.html'
// })
// )

server.pre(cors.preflight)
server.use(cors.actual)
routes.applyRoutes(server)
// console.log(port)
server.listen(port,()=>{
    console.log("This is my port")
});

