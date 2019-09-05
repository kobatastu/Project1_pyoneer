var express = require('express');
var router = express.Router();
var mysql = require('mysql');


var mysql_setting = {
    host : 'localhost',
    user : 'root',
    password : '*****',
    database : '*******',
}


router.get('/',(req,res)=>{
    if(req.session.login == null){
        res.redirect('/error');
     }else{

    var connection =mysql.createConnection(mysql_setting);
    connection.connect();

    connection.query('select * from board_table',
    function(error,results,fields){
      
        data = {'name':req.session.login.name,'results':results}
        res.render('board',data);

    })

    }


})

module.exports = router;