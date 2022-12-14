'use strict'

global.window = {document: {createElementNS: () => {return {}} }};

const express = require('express'); 
const { read } = require('fs');
const moment = require('moment');
const { AppError } = require('../bin/config');
const router = express.Router();
const con = require('../bin/config');

router.post('/getAllStudents' ,async(req, res,next) => {

  try{

    var result = await global.db.query(`SELECT * FROM studentsdetails`); 

    res.status(201).send(result);

  }
    
  catch (e) {

    res.status(400).send(e);
   
  }
  
});

router.post('/getAllTeachers' ,async(req, res,next) => {

  try{

    var result = await global.db.query(`SELECT * FROM teachersdetails`); 

    res.status(200).send(result);
    
  }
    
  catch (e) {

    res.status(400).send(e);
   
  }
  
});


router.post('/insertStudent' ,async(req, res,next) => {

  try{

    if(req.body.requestedFields.name === '' || req.body.requestedFields.gender === '' || req.body.requestedFields.address === '' || req.body.requestedFields.contactNo === '' || req.body.requestedFields.grade === '' || req.body.requestedFields.class === '' || req.body.requestedFields.regNo === '' || req.body.requestedFields.city === '') 
      return res.status(200).json('Requested fields are missing')

    let ID = Math.floor(Math.random() * 10000);

    let reqFields = {
      'StID' : ID,
      'Name' : req.body.requestedFields.name, 
      'Age' : req.body.requestedFields.age, 
      'Grade' : req.body.requestedFields.grade,
      'Class' : req.body.requestedFields.class, 
      'RegNo' : req.body.requestedFields.regNo, 
      'Address' : req.body.requestedFields.address, 
      'OlRes' : JSON.stringify(req.body.requestedFields.odinaryLevel)?.replace(/"/g, ''),
      'AlRes' : JSON.stringify(req.body.requestedFields.advanceLevel)?.replace(/"/g, ''), 
      'Complains' : req.body.requestedFields.text | "", 
      'FatherName' :req.body.requestedFields.fatherName, 
      'Gender' : req.body.requestedFields.gender, 
      'ContactNumber' : req.body.requestedFields.contactNo, 
      'Dob' : req.body.requestedFields.dob, 
      'City' : req.body.requestedFields.city, 
      'Province' : req.body.requestedFields.province, 
      'Zip' : req.body.requestedFields.zip | "", 
      'Email' : req.body.requestedFields.email,
      'stAttID': ID
    }

    var result = await global.db.query(`INSERT Into studentsdetails SET ?`, reqFields);

    res.status(200).send(result);

  }
    
  catch (e) {

    res.status(400).send(e);
   
  }
  
});

router.post('/insertTeachers' ,async(req, res,next) => {

  try{

    if(typeof req.body.requestedFields.name === 'undefined' || typeof req.body.requestedFields.age === 'undefined' || typeof req.body.requestedFields.regNo === 'undefined' || typeof req.body.requestedFields.dob === 'undefined')
      res.status(400).send('Requested fields are missing')

    let reqFields = {
       'Name': req.body.requestedFields.name,
       'Age': req.body.requestedFields.age,
       'Gender': req.body.requestedFields.gender,
       'Dob': req.body.requestedFields.dob,
      'Religion': req.body.requestedFields.religion,
       'Address': req.body.requestedFields.address,
       'ContactNo': req.body.requestedFields.contactNo,
       'City': req.body.requestedFields.city,
       'Province': req.body.requestedFields.province,
       'Zip': req.body.requestedFields.zip,
       'Email': req.body.requestedFields.email,
       'Additonal': req.body.requestedFields.text,
       'Grade': req.body.requestedFields.grade,
       'Class': req.body.requestedFields.class, 
       'RegNo': req.body.requestedFields.regNo, 
       'CivilState': req.body.requestedFields.civilState,
       'EduLevel':req.body.requestedFields.eduLevel,
       'College':req.body.requestedFields.collage,
       'Sports':req.body.requestedFields.sports,
       'PrevSchool':req.body.requestedFields.prevSchool
    }

    var result = await global.db.query(`INSERT Into teachersdetails SET ?`, reqFields);
   
      if(result.affectedRows === 1)
        res.status(200).send('Studernt record successfully added');
      else
        res.status(200).send('');

  }
    
  catch (e) {

    res.status(400).send(e);
   
  }
  
});

router.post('/updateStudent' ,async(req, res,next) => {

  try{

    if(typeof req.body.requestedFields.ID === 'undefined')
      res.status(400).send('Requested fields are missing')

    let reqFields = {
      'ID' : req.body.requestedFields.ID, 
      'Name' : req.body.requestedFields.name, 
      'Age' : req.body.requestedFields.age, 
      'Grade' : req.body.requestedFields.grade,
      'Class' : req.body.requestedFields.class, 
      'RegNo' : req.body.requestedFields.regNo, 
      'Address' : req.body.requestedFields.address, 
      'OlRes' : JSON.stringify(req.body.requestedFields.olRes) ,
      'AlRes' : JSON.stringify(req.body.requestedFields.alRes), 
      'Complains' : JSON.stringify(req.body.requestedFields.complains), 
      'FatherName' :req.body.requestedFields.fatherName, 
      'Gender' : req.body.requestedFields.gender, 
      'ContactNumber' : req.body.requestedFields.contactNumber, 
    }

    var result = await global.db.query(`UPDATE teachersdetails SET ? where ID = ?`, [reqFields, ID]);

      if(result.affectedRows === 1)
        res.status(201).send('Studernt record successfully updated');
      else
        res.status(201).send('No record updated');

    
  }
    
  catch (e) {

    res.status(400).send(e);
   
  }
  
});

router.post('/deleteStudent' ,async(req, res,next) => {

  try{

    if(typeof req.body.requestedFields.stID === 'undefined')
      res.status(400).send('Request fields are missing');

      var result = await global.db.query(`DELETE FROM Orders WHERE ID = ?`, req.body.requestedFields.ID);

      if(result.affectedRows === 1)
        res.status(201).send('Studernt record successfully deleted');
      else
        res.status(201).send('No recode deleted');

    
  }
    
  catch (e) {

    res.status(400).send(e);
   
  }
  
});

router.post('/markAttendance' ,async(req, res,next) => {

  let reqFields = {};
  let result;

  try{

    // if(typeof req.body.requestedFields[0].selectedUserID === 'undefined' || typeof req.body.requestedFields[0].name === 'undefined' || typeof req.body.requestedFields[0].date === 'undefined' || typeof req.body.requestedFields[0].status === 'undefined', typeof req.body.requestedFields[0].class === 'undefined', typeof req.body.requestedFields[0].grade === 'undefined')
    //   res.status(400).send('Requested fields are missing')

    if(req.body.requestedFields[0].attendanceType === 'students'){

      reqFields = {
        'StAttID' : req.body.requestedFields[0].selectedUserID, 
        'Name' : req.body.requestedFields[0].name, 
        'Status' : req.body.requestedFields[0].status,
        'Date' : req.body.requestedFields[0].date, 
        'Grade' : req.body.requestedFields[0].grade, 
        'Class' : req.body.requestedFields[0].class, 
      }

      let markedOrNot = await global.db.query(`SELECT * FROM studentsattendance WHERE StAttID = ? AND Date = ?`, [reqFields.StAttID , moment().format('YYYY-MM-DD')]);

      if(markedOrNot.length === 0)
        // return window.alert('already set the today Attendance');

      result = await global.db.query(`INSERT Into studentsattendance SET ?`, reqFields);

    }
    else if(req.body.requestedFields[0].attendanceType === 'teachers'){

      reqFields = {
        'TeachAttID' : req.body.requestedFields[0].selectedUserID, 
        'Name' : req.body.requestedFields[0].name,
        'Date' : req.body.requestedFields[0].date,
        'Status' : req.body.requestedFields[0].attStatus,
      }

      let markedOrNot = await global.db.query(`SELECT * FROM teachersattendance WHERE Date = ?`, moment().format('YYYY-MM-DD'));

      // if(markedOrNot.length !== 0)
      //   return window.alert('already set the today Attendance');

      result = await global.db.query(`INSERT Into teachersattendance SET ?`, reqFields);
    }
    
    // res.status(200).send(result)


  }
    
  catch (error) {

    var err = error;
    window.alert(err.error);
    window.alert(err.error);
    this.form.reset();
   
  }
  
});

router.post('/getAttendance' ,async(req, res,next) => {

  let allStudents;
  let allTeachers;

  try{

    if(req.body.requestedFields.allStudnet === true && req.body.requestedFields.allTeachers === true){
      allStudents = await global.db.query(`SELECT * FROM studentsattendance`); 
      allTeachers = await global.db.query(`SELECT * FROM teachersattendance`); 
    }
    else if(req.body.requestedFields.resType === 'students'){

      if(req.body.requestedFields.AttID === 'undefined')
        console.log('request fields are missing')

      allStudents = await global.db.query(`SELECT * FROM studentsattendance WHERE StAttID = ?`, req.body.requestedFields.AttID); 
    }
    else if(req.body.requestedFields.resType === 'teachers'){

      if(typeof req.body.requestedFields.AttID === 'undefined')
        console.log('request fields are missing')

      allTeachers = await global.db.query(`SELECT * FROM teachersattendance WHERE TeachAttID = ?`, req.body.requestedFields.AttID); 
    }
      
    res.status(201).send({allStudents : allStudents, allTeachers : allTeachers});

  }
    
  catch (e) {

    res.status(400).send(e);
   
  }
  
});

module.exports = router;