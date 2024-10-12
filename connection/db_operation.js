const { openConnection } = require("./db_connector.js");
const { logMetering, logApplication } = require('../logger/logger.js');
const config = require('../config/config.json');

async function executeQuery(query, params) {
    const startTime = new Date();
    const currentFunction = 'executeQuery';
    const currentFile = 'db_operation.js';
    const tenantName = config.tenant_name;
    const tenantId = config.tenant_id;

    logApplication("INFO", tenantName, tenantId, userEmail, currentFile, currentFunction, `${currentFunction} started`);

    try {
        const pool = await openConnection();
        const results = await pool.query(query, params);
        // console.log("Hii")
        const endTime = new Date();
        logMetering(tenantName, tenantId, userEmail, currentFile, currentFunction, startTime, endTime);
        return results;
    } catch (err) {
        logApplication("ERROR", tenantName, tenantId, userEmail, currentFile, currentFunction, "Error occurred in executeQuery");
        console.log("Error is", err.code);
        const endTime = new Date();
        logMetering(tenantName, tenantId, userEmail, currentFile, currentFunction, startTime, endTime);
        return err
    }
}

async function executeTransaction(queries, email) {
    const startTime = new Date();
    const currentFunction = 'executeTransaction';
    const currentFile = 'db_operation.js';
    const tenantName = config.tenant_name;
    const tenantId = config.tenant_id;
    let connection;

    logApplication("INFO", tenantName, tenantId, email, currentFile, currentFunction, `${currentFunction} started`);

    try {
        const pool = await openConnection();
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const results = [];
        for (const { query, params } of queries) {
            const result = await connection.query(query, params);
            results.push(result);
        }

        await connection.commit();
        const endTime = new Date();
        logMetering(tenantName, tenantId, email, currentFile, currentFunction, startTime, endTime);
        return { status: "Success", results };
    } catch (err) {
        if (connection) await connection.rollback();
        logApplication("ERROR", tenantName, tenantId, email, currentFile, currentFunction, `Transaction failed: ${err.message}`);
        const endTime = new Date();
        logMetering(tenantName, tenantId, email, currentFile, currentFunction, startTime, endTime);
        throw err;
    } finally {
        if (connection) await connection.release();
    }
}



module.exports = {
    executeQuery,
    executeTransaction
};


// const {getConnection}=require("./db_connector.js")
// const { logMetering, logApplication } = require('../logger/logger.js');
// const queries = require("./query.js");
// const config = require('../config/config.json');

// function executeQuery(query,params){
//     const startTime = new Date();
//     const currentFunction = 'executeQuery';
//     const currentFile = 'db_operation.js';
//     const tenantName = config.tenant_name;
//     const tenantId = config.tenant_id;

//     logApplication("INFO",tenantName, tenantId , userEmail, currentFile, currentFunction,`${currentFunction} started`)

//     return new Promise((resolve)=>{
//         getConnection()
//         .then(connection =>{
//             connection.query(query,params,(err,results)=>{
//                 connection.release();
//                 if(err){
//                     logApplication("ERROR",tenantName, tenantId , userEmail, currentFile, currentFunction,"Error occured in executeQuery")
//                     console.log("Error is",err)
//                     resolve(err);
//                 }else{
//                 resolve(results);
//                 }
//             });
//         })
//         .catch(err=>{
//             logApplication("ERROR",tenantName, tenantId , userEmail, currentFile, currentFunction,"Error occured")
//             console.log(err)
//             resolve(err)
//         })
//         logApplication("INFO",tenantName, tenantId , userEmail, currentFile, currentFunction,`${currentFunction} ended`)
//         const endTime = new Date();
//         logMetering(tenantName, tenantId, userEmail, currentFile, currentFunction, startTime, endTime);
//     });
// };
// module.exports={
//     executeQuery
// };

        
