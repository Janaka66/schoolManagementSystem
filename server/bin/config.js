'use strict'

const winston = require('winston');
const {parseUri} = require('mysql-parse');


/* ---Configure logging--- */

var logLevel;
var deep_debug = false;         //Enable this if you need all silly log messages

if (process.env.NODE_ENV === 'production')
    logLevel = 'info'
else
    logLevel = 'debug'
    
if (deep_debug)
    logLevel = 'silly';

var log = winston.createLogger({
    level: logLevel, 
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console()
    ]
    
})

console.log(process.env.MYSQL_URL)
/* --- Configure Database Access---*/

if (process.env.MYSQL_URL) { 
       
    var mysql = require('promise-mysql');

    sqlConnect(process.env.MYSQL_URL);
   
}



async function sqlConnect(connectionStr) {
    try {
        //console.log(connectionStr);

        var connOptions = parseUri(connectionStr);

        delete connOptions.scheme;
        connOptions.connectionLimit = 15;
        connOptions.connectionLimit = 15;

        global.db = await mysql.createPool(connectionStr); 

        log.info('Connected to the database');
    }
    catch(e) {
        log.error('Error connecting to the database. Info:' + e);
    }    
}


/* --- Error class ---*/
var AppError = class appError extends Error {

    constructor(eType, iCode, devMessage, eCode, returnCode, ...params) {
        super(...params);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, appError);
        }

        this.type = eType; 
        this.internalCode = iCode;  
        this.devMessage = devMessage;    
        this.errorCode = eCode;
        this.returnCode = returnCode;
    }

    static get types() {
        return this.getTypes();
    };

    static getTypes() {
        return {
            systemError: 0,
            securityError: 1,
            userError: 2
        }
    }

    static shouldLog(err) {
        return err.type === this.getTypes().securityError || err.type === this.getTypes().systemError
    }
}

/* --- Export modules--- */
module.exports.log = log;
module.exports.AppError = AppError;