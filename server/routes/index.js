'use strict'

const fs = require('fs');
const path = require('path');

var routes = new Object();

fs.readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function (fileName) {        
        routes[fileName.split('.')[0]] = require(path.join( __dirname, fileName));
    });

module.exports = routes;