'use strict'

const express = require('express');
const app = express();
const routes = require('./routes');
const log = require('./bin/config').log;
const bodyParser = require('body-parser');
const url = require('url');


//Expect a JSON body
app.use(bodyParser.json({
    limit: '50mb'                   //Request size - 50MB
}));

//Handle CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    if ('OPTIONS' == req.method) {
        res.status(200).send();
    } else {
        next();
    }
});


//Health Checker
app.use('/healthz', async (req, res) => {

    return res.status(200).json({
        ping: 'PONG'
    }) 
});


//Version
app.use('/ver', (req, res) => {
    res.status(200).send('0.1.0');
});



//------------------------- Open Routes -------------------------//
app.use('/test', routes.test);
app.use('/auth', routes.login);

// app.use(function verifyToken (req,res,next) {

//     const bearerHeader= req.body.headers.lazyUpdate[0].value

//     if(!bearerHeader)
//        return res.status(400).send('Invalied token'); 

//     const bearer = bearerHeader.split(' ');
//     const bearerToken = bearer[1];
//     req.headers['authorization'] = bearerToken;
    
//     try {

//         var decodedToken = jwt(bearerToken);
//         res.locals.uID = decodedToken.uID;   
//         res.locals.uNmae = decodedToken.username;  
//         next();
        
//     } 
//     catch (error) {
//         return res.status(400).send('Athuntication faild');
//     }
        
// });
  
app.use('/crud', routes.crud);

//Common error handler
app.use(function errorHandler(err, req, res, next){
    if (res.headersSent) {
        log.error(`Name: ${err.name},  End-point: ${req.originalUrl}, Message: ${err.message}, StatusCode: ${err.returnCode}, Internal Code: ${err.internalCode}, DevMessage: ${err.devMessage}, Address: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`);
        return;
    }

    
    log.error(`Name: ${err.name},  End-point: ${req.originalUrl}, Message: ${err.message}, StatusCode: ${err.returnCode}, Internal Code: ${err.internalCode}, DevMessage: ${err.devMessage}, Address: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`);
   
    if (process.env.NODE_ENV !== 'production') {

        //err.message now has only 3 own properties. We need to get "stack" and "message" properties front 
        Object.defineProperty(err, 'message', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: err.message
        });

        Object.defineProperty(err, 'stack', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: err.stack
        });


        res.status(err.returnCode).json(err.message);
    }    
    else {

        //Delete unnecessary fileds in production
        delete err.type;
        delete err.devMessage;
        delete err.internalCode;
        res.status(err.returnCode).json(err.message); 
    }

}) 


module.exports = app;