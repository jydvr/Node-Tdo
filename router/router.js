const Router=require('restify-router').Router;
const checkUser = require('../service/service.js');
const server=new Router();

server.post('/login',checkUser.checkUser);
server.post('/reg',checkUser.regUser);
server.post('/createtask',checkUser.createTask)
server.post('/updatetask',checkUser.updateTask)
server.post('/display',checkUser.displayTask)
server.post('/deletetask',checkUser.deleteTask)
server.post('/edit',checkUser.editTask)
module.exports=server;