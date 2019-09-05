var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var {check, validationResult} = require('express-validator');

var mysql_setting = {
    host : 'localhost',
    user : 'root',
    password : '*****',
    database : '*****',
}

router.get('/',(req,res)=>{
    res.render('withdraw');
})

router.post('/',(req,res)=>{

    var id = req.session.login.id;

    var data = {'life_flg':0}

    var connection =mysql.createConnection(mysql_setting);
    connection.connect();

    connection.query('update user_table set ? where id = ?',[data,id],
    function(error,results,fields){
        res.redirect('/logout');
    })
   connection.end();
})

module.exports = router;