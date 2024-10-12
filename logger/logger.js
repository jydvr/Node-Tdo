const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const path = require('path');

const meteringFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp}|METERING|${message}`;
});

const applicationFormat = printf(({ timestamp, level,tenantName, tenantId, userEmail,currentFile, currentFunction, message }) => {
    return `${timestamp} | ${level} | ${tenantName} | ${tenantId} | ${userEmail} | ${currentFile} | ${currentFunction} | ${message}`;
});

const meteringLogger = createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        meteringFormat
    ),
    transports: [
        new transports.File({ filename: path.join("logs", 'logs', 'metering.log') })
    ]
});

const applicationLogger = createLogger({
    //  level: 'INFO',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss,SSS' }),
        applicationFormat
    ),
    transports: [
        new transports.File({ filename: path.join("logs", 'logs', 'application.log') })
    ]
});

function logMetering(tenantName, tenantId, userEmail, currentFile, currentFunction, startTime, endTime){
    const duration = (endTime - startTime)
    const logMessage = `${tenantName}|${tenantId}|${userEmail}|${currentFile}|${currentFunction}|Execution time: ${duration}ms`;
    meteringLogger.info(logMessage)
}

function logApplication(level,tenantName, tenantId, userEmail, currentFile,currentFunction, message) {
    switch (level.toUpperCase()) {
        case 'ERROR':
            applicationLogger.error(message,{level, tenantName, tenantId, userEmail, currentFile, currentFunction });
            break;
        case 'INFO':
        default:
            applicationLogger.info(message, {level, tenantName, tenantId, userEmail, currentFile, currentFunction });
            break;
    }
}

module.exports = {
    logMetering,
    logApplication
};