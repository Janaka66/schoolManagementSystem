'use strict'
const express = require('express');
const router = express.Router();
const httpError = require('throw.js');
const {appError} = require('../bin/config.js');



router.get('/me', async (req, res, next) => {
    res.status(200).send('Tested. See the logs for a sample error record');

    var sampleError = new appError(appError.types.systemError, 0, 'A developer? ...this is just a sample error', 'a sample error message');

    next(new httpError.Gone(sampleError));
})


module.exports = router;