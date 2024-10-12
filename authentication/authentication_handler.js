const jwt=require("jsonwebtoken")
const checkUser=require("../service/service")
const secretkey=require("../config/config.json")
const { logMetering, logApplication } = require('../logger/logger.js');
// const config = require('../config/config.json');

function generateKey(user){
        const startTime = new Date();
        const tenantName = secretkey.tenant_name;
        const tenantId = secretkey.tenant_id;
        const currentFunction = 'generateKey';
        const currentFile = 'authentication_handler';
    
        try{
            logApplication("INFO", tenantName, tenantId, userEmail, currentFile, currentFunction, `${currentFunction} started`);

            const {user_id,firstname,lastname,email} = user
            // console.log(jwt.sign({user_id,firstname,lastname,email},secretkey.secret_key,{expiresIn:'1h'}))
            return jwt.sign({user_id,firstname,lastname,email},secretkey.secret_key,{expiresIn:'1h'});
        }
        catch(err){
            logApplication("ERROR", tenantName, tenantId, userEmail, currentFile, currentFunction, "Error occurred in generateKey");
            return("Error occured in token generation",err)
        }
        finally{
            logApplication("INFO", tenantName, tenantId, userEmail, currentFile, currentFunction, `${currentFunction} ended`);
            const endTime = new Date();
            logMetering(tenantName, tenantId, userEmail, currentFile, currentFunction, startTime, endTime);
        }
    }

function validateToken(token){
    const startTime = new Date();
    const tenantName = secretkey.tenant_name;
    const tenantId = secretkey.tenant_id;
    const currentFunction = 'validateToken';
    const currentFile = 'authentication_handler';
    try{     
         const currentFunction = 'validateToken';
        const currentFile = 'authentication_handler';
        // console.log(secretkey.tenant_name)
    
        logApplication("INFO", tenantName, tenantId, userEmail, currentFile, currentFunction, `${currentFunction} started`);

        const valid = jwt.verify(token,secretkey.secret_key);
        console.log(valid)
        return("Token validated success",valid)
    }
    catch(error){
        logApplication("ERROR", tenantName, tenantId, userEmail, currentFile, currentFunction, "Error occurred in validateToken");
        return false
    }
    finally{
        const endTime = new Date();
        logMetering(tenantName, tenantId, userEmail, currentFile, currentFunction, startTime, endTime);
        logApplication("INFO", tenantName, tenantId, userEmail, currentFile, currentFunction, `${currentFunction} ended`);
    }
}

const handleTokenValidation=async(req,res)=>{
    const startTime = new Date();
    const tenantName = secretkey.tenant_name;
    const tenantId = secretkey.tenant_id;
    const currentFunction = 'handleTokenValidation';
    const currentFile = 'authentication_handler';
    try{
        console.log(secretkey.tenant_name)
        console.log(secretkey.tenant_name)
        logApplication("INFO", tenantName, tenantId, userEmail, currentFile, currentFunction, `${currentFunction} started`);
        const auth_header=req.headers['authorization'];
        if(!auth_header){
            // console.log("HIi")
            res.send(200, { "status":"Failed","Status code":501,error: 'DFailed' });
            return false
        }
        else{
            const token=auth_header.split(' ')[1];
            if(!token){
                logApplication("ERROR", tenantName, tenantId, userEmail, currentFile, currentFunction, `ERROR : Token not present`);
                res.send(200, { "status":"Failed","Status code":502,error: 'DFailed' });
                return false
            }else{
                const is_token_valid=validateToken(token);
                if(is_token_valid==false){
                    logApplication("ERROR", tenantName, tenantId, userEmail, currentFile, currentFunction, `ERROR: Token not valid`);
                    res.send(200, { "status":"Failed","Status code":503,error: 'DFailed' });
                    return false
                }else
                    return is_token_valid;
                }
            }
        }
    catch(error){
        logApplication("ERROR", tenantName, tenantId, userEmail, currentFile, currentFunction, `ERROR: ${currentFunction} Failed` );
        console.log(error)
        res.send(401, { "status":"Failed","Status code":504,error: 'DFailed' });
        return false
    }
    finally{
        const endTime = new Date();
        logMetering(tenantName, tenantId, userEmail, currentFile, currentFunction, startTime, endTime);
        logApplication("INFO", tenantName, tenantId, userEmail, currentFile, currentFunction, `${currentFunction} ended`);
    }

   
}
module.exports={
    generateKey,
    validateToken,
    handleTokenValidation
};
