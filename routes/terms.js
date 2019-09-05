var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var {check, validationResult} = require('express-validator');

router.get('/',(req,res)=>{
    res.render('terms');
})

module.exports = router;