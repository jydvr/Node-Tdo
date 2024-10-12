const md5=require("md5")
const { executeQuery,executeTransaction } = require('../connection/db_operation.js');
const queries = require('../connection/query.js');
const {generateKey, validateToken,handleTokenValidation}=require('../authentication/authentication_handler.js');
const { logMetering, logApplication } = require('../logger/logger.js');
const { info, level } = require("winston");
const config = require('../config/config.json');
const{openConnection}=require('../connection/db_connector.js')

userEmail='';

async function checkUser(req, res) {
    const startTime = new Date();
    const currentFunction = 'checkUser';
    const currentFile = 'service.js';
    const tenantName = config.tenant_name;
    const tenantId = config.tenant_id;
    const { username, password } = req.body;
    let level="INFO"
    userEmail=username
    logApplication(level,tenantName, tenantId , userEmail, currentFile, currentFunction,`${currentFunction} started`)
    const mdpassword=md5(password)

    if (!username || !mdpassword) {
        level="ERROR"
        logApplication(level,tenantName, tenantId, userEmail,currentFile, currentFunction, "Error occured")
        res.send(400, { "status":"Failed","Status code":400,error: 'Username and password are required',"data":[] });
    }

    try {
        const user = await executeQuery(queries.login, [username, mdpassword]);
        // console.log([username, mdpassword])
        if (user.length > 0) {
            // console.log(user)
            userEmail = user[0].email;
            const token=generateKey(user[0])
            logApplication(level,tenantName, tenantId, userEmail,currentFile, currentFunction, "Authentication successful");
            res.send(200, {"status":"Success","Status code":200, message: 'Authentication successful',token, user: user[0] });

        } else {
            level="ERROR"
            logApplication(level,tenantName, tenantId, userEmail,currentFile, currentFunction,"Error: Invalid username or password");
            // token = 'djdjdj'
            // res.send(401, {"status":"Success","Status code":201, message: 'Invalid username or password' });
            res.send(200, {"status":"Failed","Status code":400, message: 'Authentication successful'});

        }
    }
    catch (err) {
        level="ERROR"
        console.error('Error occurred:', err);
        logApplication(level,tenantName, tenantId, userEmail, currentFile,currentFunction, `Error occurred: ${err.message}`);
        res.send(500, { "status":"Failed","Status code":500,message: 'Internal server error' });
    }
    finally {
        logApplication("INFO",'GBB', tenantId, userEmail, currentFile,currentFunction, `${currentFunction} ended`)
        const endTime = new Date();
        logMetering(tenantName, tenantId, userEmail, currentFile, currentFunction, startTime, endTime);
    }
}


async function regUser(req, res) {
    const startTime = new Date();
    const currentFunction = 'regUser';
    const currentFile = 'service.js';
    const tenantName = config.tenant_name;
    const tenantId = config.tenant_id;
    const {firstname,lastname,email, username, password } = req.body;
    logApplication(level,tenantName, tenantId , userEmail, currentFile, currentFunction,`${currentFunction} started`)
    console.log(email)
    const mdpassword=md5(password)
    try{
        console.log(firstname,lastname,email,username,password)
    if (!firstname || !lastname || !email || !username || !mdpassword) {
        logApplication("ERROR", tenantName, tenantId, email, currentFile, currentFunction, "Error incomplete details");
        return res.send(400, {"status":"Failed","Status code":400,message: 'Enter all details' });
    }else{
        const user = await executeQuery(queries.reg, [firstname,lastname,email,username, mdpassword]);
        if (user && !user.errno) {
            logApplication("INFO", tenantName, tenantId, email, currentFile, currentFunction, "User Registered Successfully");
            res.send(200, { status: "Success", "Status code": 200, message: 'User registered successfully', "data": [] });
        } else {
            console.log(user.code)
            if (user.code=="ER_DUP_ENTRY") { 
                logApplication("ERROR", tenantName, tenantId, email, currentFile, currentFunction, "Error: Duplicate Entry");
                res.send(400, {
                    "status": "Failed",
                    "Status code": 400,
                    "message": "Duplicate Entry",
                    "data": []
                });
            }
            else {
                logApplication("ERROR", tenantName, tenantId, email, currentFile, currentFunction, "Invalid Entry");
                res.send(401, { "status":"Failed","Status code":401,message: 'Invalid entry' });
            }}
    }} catch (err) {
        logApplication("ERROR", tenantName, tenantId, email, currentFile, currentFunction, "Internal Server Error");
        res.send(500, { "status":"Failed","Status code":500,message: 'Internal server error' });
    }
    finally {
        const endTime = new Date();
        logApplication("INFO", tenantName, tenantId, email, currentFile, currentFunction,`${currentFunction} ended`);
        logMetering(tenantName, tenantId, userEmail, currentFile, currentFunction, startTime, endTime);
    }
}
// async function createTask(req, res) {
//     const startTime = new Date();
//     const currentFunction = 'createTask';
//     const currentFile = 'service.js';
//     const tenantName = config.tenant_name;
//     const tenantId = config.tenant_id;
//     let email;
//     logApplication("INFO", tenantName, tenantId, email, currentFile, currentFunction, `${currentFunction} started`);
//     try {
//         const valid_token = await handleTokenValidation(req, res);
//         if (!valid_token) return;
//         email = valid_token.email;
//         const user_id = valid_token.user_id;
//         const { task_name, task_description, start_date, end_date } = req.body;
//         if (!task_name.trim() || !task_description.trim() || !start_date.trim() || !end_date.trim()) {
//             res.send(401, { "status": "Failed", "Status code": 401, error: 'Invalid entry' });
//             return;
//         }
//         const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
//         if (!dateFormat.test(start_date) || !dateFormat.test(end_date)) {
//             logApplication("ERROR", tenantName, tenantId, email, currentFile, currentFunction, "Error in date format");
//             res.send(401, { "status": "Failed", "Status code": 401, error: 'Invalid date format. Use yyyy-mm-dd.' });
//             return;
//         }
//         const taskParams = [task_name, task_description, start_date, end_date];
//         try {
//             const transactionResult = await executeTransaction([
//                 { query: queries.createTask, params: taskParams },
//             ], email);

//             if (transactionResult.status !== "Success") {
//                 res.send(500, { status: "Failed", "Status code": 500, error: 'Failed to create task' });
//                 return;
//             }
//             const taskId = transactionResult.results[0].insertId; 
//             const mapTaskResult = await executeTransaction([
//                 { query: queries.map_task, params: mapTaskParams },
//             ], email);

//             if (mapTaskResult.status !== "Success") {
//                 res.send(500, { status: "Failed", "Status code": 500, error: 'Failed to map task' });
//                 return;
//             }

//             logApplication("INFO", tenantName, tenantId, email, currentFile, currentFunction, "Task created successfully");
//             res.send(200, { status: "Success", "Status code": 200, message: 'Task created successfully' });

//             const endTime = new Date();
//             logMetering(tenantName, tenantId, email, currentFile, currentFunction, startTime, endTime);
//         } catch (error) {
//             console.log(error);
//             logApplication("ERROR", tenantName, tenantId, email, currentFile, currentFunction, "Error: Failed to create task");
//             res.send(500, { status: "Failed", "Status code": 500, error: 'Failed to create task' });
//         } finally {
//             const endTime = new Date();
//             logApplication("INFO", tenantName, tenantId, email, currentFile, currentFunction, `${currentFunction} ended`);
//             logMetering(tenantName, tenantId, email, currentFile, currentFunction, startTime, endTime);
//         }
//     } catch (error) {
//         console.log(error);
//         logApplication("ERROR", tenantName, tenantId, email, currentFile, currentFunction, "Server error");
//         res.send(500, { status: "Failed", "Status code": 500, error: 'Server error' });
//     }
// }

async function createTask(req, res) {
    const startTime = new Date();
    const currentFunction = 'createTask';
    const currentFile = 'service.js';
    const tenantName = config.tenant_name;
    const tenantId = config.tenant_id;
    let email;
    logApplication("INFO", tenantName, tenantId, email, currentFile, currentFunction, `${currentFunction} started`);

    try {
        const valid_token = await handleTokenValidation(req, res);
        if (valid_token==false) {return};
        email = valid_token.email;
        const user_id = valid_token.user_id;
        const { task_name, task_description, start_date, end_date } = req.body;

        if (!task_name.trim() || !task_description.trim() || !start_date.trim() || !end_date.trim()) {
            res.send(401, { "status": "Failed", "Status code": 401, error: 'Invalid entry' });
            return;
        }

        const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateFormat.test(start_date) || !dateFormat.test(end_date)) {
            logApplication("ERROR", tenantName, tenantId, email, currentFile, currentFunction, "Error in date format");
            res.send(401, { "status": "Failed", "Status code": 401, error: 'Invalid date format. Use yyyy-mm-dd.' });
            return;
        }
        if (end_date<start_date){
            res.send(401, { "status": "Failed", "Status code": 401, error: 'Invalid date format. end date less than start date' });
            return
        }
        const taskParams = [task_name, task_description, start_date, end_date];     
        try {
            const transactionResult = await executeTransaction([
                { query: queries.createTask, params: taskParams },
            ], email);

            if (transactionResult.status !== "Success") {
                res.send(500, { status: "Failed", "Status code": 500, error: 'Failed to create task' });
                return;
            }

            const taskId = transactionResult.results[0].insertId; 
            const effective_start_date = new Date();
            const mapTaskParams = [user_id, taskId, effective_start_date];
            const mapTaskResult = await executeTransaction([
                { query: queries.map_task, params: mapTaskParams },
            ], email);

            if (mapTaskResult.status !== "Success") {
                res.send(500, { status: "Failed", "Status code": 500, error: 'Failed to map task' });
                return;
            }

            logApplication("INFO", tenantName, tenantId, email, currentFile, currentFunction, "Task created successfully");
            res.send(200, { status: "Success", "Status code": 200, message: 'Task created successfully' });

        } catch (error) {
            console.log(error);
            logApplication("ERROR", tenantName, tenantId, email, currentFile, currentFunction, "Error: Failed to create task");
            res.send(500, { status: "Failed", "Status code": 500, error: 'Failed to create task' });
        } finally {
            const endTime = new Date();
            logApplication("INFO", tenantName, tenantId, email, currentFile, currentFunction, `${currentFunction} ended`);
            logMetering(tenantName, tenantId, email, currentFile, currentFunction, startTime, endTime);
        }
    } catch (error) {
        console.log(error);
        logApplication("ERROR", tenantName, tenantId, email, currentFile, currentFunction, "Server error");
        res.send(500, { status: "Failed", "Status code": 500, error: 'Server error' });
    }
}


async function updateTask(req, res) {
    const { task_id, log_description, percentage } = req.body;
    console.log(req.body)
    const currentFunction = 'updateTask';
    const currentFile = 'service.js';
    const tenantName = config.tenant_name;
    const tenantId = config.tenant_id;
    const startTime = new Date();

    logApplication("INFO", tenantName, tenantId, null, currentFile, currentFunction, `${currentFunction} started`);

    try {
        const valid_token = await handleTokenValidation(req, res);
        if (valid_token==false) {return};

        const email = valid_token.email;
        const queries1 = [
            {
                query: queries.Exists,
                params: [task_id]
            },
            {
                query: queries.getPercentageSum,
                params: [task_id]
            }];
         const queries2 = [    {
                query: queries.insertLog,
                params: [task_id, log_description, new Date(), percentage]
            },
            {
                query: queries.updateTaskEndDate,
                params: [new Date(), task_id]
            }
        ];
        const { status, results } = await executeTransaction(queries1, email);
        if (status === "Success") {
            const sumResult = results[1];
            const currentSum = sumResult[0].sum || 0;
            console.log(parseFloat(percentage))
            if(parseFloat(currentSum) + parseFloat(percentage) > 100){
                res.send(200, { status: "Failed", "Status code": 200, message: "Log cannot be updated percentage limit exceeded" });
                logApplication("INFO", tenantName, tenantId, email, currentFile, currentFunction, "Log updation Failed");}
            else if (parseFloat(currentSum) + parseFloat(percentage) === 100) {
                await executeTransaction(queries2, email)
                res.send(200, { status: "Success", "Status code": 200, message: "Log updated Successfully and task completed" });
                logApplication("INFO", tenantName, tenantId, email, currentFile, currentFunction, "Log updated successfully");
            }
            else {
                await executeTransaction(queries2, email)
                res.send(200, { status: "Success", "Status code": 200, message: "Log updated Successfully" });
                logApplication("INFO", tenantName, tenantId, email, currentFile, currentFunction, "Log updated, but task not completed");
            }
        } else {
            res.send(500, { status: "Failed", "Status code": 500, message: "Failed to update log" });
            logApplication("ERROR", tenantName, tenantId, email, currentFile, currentFunction, "Failed to update log");
        }

        const endTime = new Date();
        logMetering(tenantName, tenantId, email, currentFile, currentFunction, startTime, endTime);

    } catch (error) {
        console.log(error);
        res.send(500, { status: "Failed", "Status code": 500, message: "Server error" });
        logApplication("ERROR", tenantName, tenantId, null, currentFile, currentFunction, "Server error");
    }
}


async function displayTask(req,res) {
    const currentFunction = 'displayTask';
    const currentFile = 'service.js';
    const tenantName = config.tenant_name;
    const tenantId = config.tenant_id;
    const startTime = new Date();

    logApplication("INFO", tenantName, tenantId, null, currentFile, currentFunction, `${currentFunction} started`);

    try {
        const valid_token = await handleTokenValidation(req, res);
        if (valid_token==false) {
            return;
        }
        const {userid} = req.body;
        console.log(valid_token)
        const email = valid_token.email;
        const user = await executeQuery(queries.displays,[userid]);
        if (user) {
            res.send(200, { status: "Success", "Status code": 200, message: "Displayed successfully" ,data:user});
            logApplication("INFO", tenantName, tenantId, email, currentFile, currentFunction, "Log updated successfully");
        } else {
            res.send(200, { status: "Failed", "Status code": 500, message: "Failed to display" });
            logApplication("ERROR", tenantName, tenantId, email, currentFile, currentFunction, "Failed to update log");
        }

        const endTime = new Date();
        logMetering(tenantName, tenantId, email, currentFile, currentFunction, startTime, endTime);

    } catch (error) {
        console.log(error);
        res.send(500, { status: "Failed", "Status code": 500, message: "Server error" });
        logApplication("ERROR", tenantName, tenantId, null, currentFile, currentFunction, "Server error");
    }
}


async function deleteTask(req,res) {
    const currentFunction = 'deleteTask';
    const currentFile = 'service.js';
    const tenantName = config.tenant_name;
    const tenantId = config.tenant_id;
    const startTime = new Date();

    logApplication("INFO", tenantName, tenantId, null, currentFile, currentFunction, `${currentFunction} started`);

    try {
        const valid_token = await handleTokenValidation(req, res);
        if (valid_token==false) {
            return;
        }
        const {task_id} = req.body;
        console.log(valid_token)
        const email = valid_token.email;
        const taskcheck = await executeQuery(queries.taskCheckQuery,[task_id]);
        console.log(taskcheck)
        if (taskcheck.affectedRows=="") {
            res.send(200,{ status: "Failed", "Status code": 404, message: "Task not found" });
            logApplication("ERROR", tenantName, tenantId, null, currentFile, currentFunction, "Task not found");
            return;
        }

        if (taskcheck.effective_end_date) {
            res.send(200,{ status: "Failed", "Status code": 400, message: "Task already deleted" });
            logApplication("WARN", tenantName, tenantId, null, currentFile, currentFunction, "Task already deleted");
            return;
        }

        // const user = await executeQuery(queries.delTask,[new Date(),userid]);
        // console.log(user)
        const queries1 = [
            {
                query: queries.delusertask,
                params: [new Date(),task_id]
            },
            {
                query: queries.delTask,
                params: [new Date(),task_id]
            }];
        const user = await executeTransaction(queries1);
        console.log(user)
        console.log(user.results[0])
        if (user.results[0].changedRows>0 ||user.results[1].changedRows>0) {
            res.send(200, { status: "Success", "Status code": 200, message: "Deleted successfully" ,data:user});
            logApplication("INFO", tenantName, tenantId, email, currentFile, currentFunction, "Log updated successfully");
        } else {
            res.send(200, { status: "Failed", "Status code": 500, message: "Failed to delete already deleted" });
            logApplication("ERROR", tenantName, tenantId, email, currentFile, currentFunction, "Failed to update log");
        }

        const endTime = new Date();
        logMetering(tenantName, tenantId, email, currentFile, currentFunction, startTime, endTime);

    } catch (error) {
        console.log(error);
        res.send(500, { status: "Failed", "Status code": 500, message: "Server error" });
        logApplication("ERROR", tenantName, tenantId, null, currentFile, currentFunction, "Server error");
    }
}

async function editTask(req,res) {
    const currentFunction = 'editTask';
    const currentFile = 'service.js';
    const tenantName = config.tenant_name;
    const tenantId = config.tenant_id;
    const startTime = new Date();

    logApplication("INFO", tenantName, tenantId, null, currentFile, currentFunction, `${currentFunction} started`);

    try {
        const valid_token = await handleTokenValidation(req, res);
        if (valid_token==false) {
            return;
        }
        const {task_id} = req.body;
        console.log(valid_token)
        const email = valid_token.email;
        const user = await executeQuery(queries.edit,[task_id]);
        if (user) {
            res.send(200, { status: "Success", "Status code": 200, message: "Task started " ,data:user});
            logApplication("INFO", tenantName, tenantId, email, currentFile, currentFunction, "Task started ");
        } else {
            res.send(200, { status: "Failed", "Status code": 500, message: "Failed to start task" });
            logApplication("ERROR", tenantName, tenantId, email, currentFile, currentFunction, "Failed to start task");
        }

        const endTime = new Date();
        logMetering(tenantName, tenantId, email, currentFile, currentFunction, startTime, endTime);

    } catch (error) {
        console.log(error);
        res.send(500, { status: "Failed", "Status code": 500, message: "Server error" });
        logApplication("ERROR", tenantName, tenantId, null, currentFile, currentFunction, "Server error");
    }
}


module.exports = {
    checkUser,
    regUser,
    createTask,
    updateTask,
    displayTask,
    deleteTask,
    editTask
};











