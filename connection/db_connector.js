const mysql = require('promise-mysql');
const config = require('../config/config.json');
const { logMetering, logApplication } = require('../logger/logger.js');
const currentFile = 'db_connector.js';
const tenantName = config.tenant_name;
const tenantId = config.tenant_id;

let pool;

async function createConn() {
    const startTime = new Date();
    const currentFunction = 'createConn';
    logApplication("INFO", tenantName, tenantId, userEmail, currentFile, currentFunction, `${currentFunction} started`);

    pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '123123',
        database: 'todo',
        connectionLimit: 10 // Add connection limit or other options if needed
    });

    logApplication("INFO", tenantName, tenantId, userEmail, currentFile, currentFunction, `${currentFunction} ended`);
    const endTime = new Date();
    logMetering(tenantName, tenantId, userEmail, currentFile, currentFunction, startTime, endTime);

    return pool;
}

async function openConnection() {
    try{
    const startTime = new Date();
    const currentFunction = 'openConnection';
    logApplication("INFO", tenantName, tenantId, userEmail, currentFile, currentFunction, `${currentFunction} started`);
    
    if (!pool) {
        await createConn();
    }

    const endTime = new Date();
    logMetering(tenantName, tenantId, userEmail, currentFile, currentFunction, startTime, endTime);

    return pool; 
}catch(err){
    console.log("Having error",err)
    logApplication("INFO", tenantName, tenantId, userEmail, currentFile, currentFunction, `ERROR in ${currentFunction}`);
}

}

module.exports = {
    openConnection
};


// const mysql=require("mysql");
// const config = require('../config/config.json');
// const { logMetering, logApplication } = require('../logger/logger.js');
// const currentFile = 'db_operation.js';
// const tenantName = config.tenant_name;
// const tenantId = config.tenant_id;

// function createConn(){
//     const startTime = new Date();
//     const currentFunction = 'createConn';
//     logApplication("INFO",tenantName, tenantId , userEmail, currentFile, currentFunction,`${currentFunction} started`)
//     pool=mysql.createPool({
//         host: 'localhost',
//         user: 'root',
//         password: '123123',
//         database: 'todo'
//     });
//     logApplication("INFO",tenantName, tenantId , userEmail, currentFile, currentFunction,`${currentFunction} ended`)
//     const endTime = new Date();
//     logMetering(tenantName, tenantId, userEmail, currentFile, currentFunction, startTime, endTime);
//     return pool;
// }

// function getConnection(){
//     const startTime = new Date();
//     const currentFunction = 'getConnection';
//     logApplication("INFO",tenantName, tenantId , userEmail, currentFile, currentFunction,`${currentFunction} started`)
//     return new Promise((resolve)=>{
//         pool=createConn()
//         pool.getConnection((err,connection)=>{
//             if(err){
//                 console.log("Error occured");
//                 resolve(err);
//             }
//             else{
//                 console.log("Obtained database connection");
//                 resolve(connection);
//             }
//         });
//         const endTime = new Date();
//         logMetering(tenantName, tenantId, userEmail, currentFile, currentFunction, startTime, endTime);
        
//     });
    
// };
// //

// module.exports={
//     getConnection
// };