var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var {check, validationResult} = require('express-validator');

var mysql_setting = {
    host : 'localhost',
    user : 'root',
    password : '******',
    database : '******',
}

router.get('/',(req,res)=>{

    var sid = req.session.login.id;
    var rid = req.query.rid;
  
    var connection =mysql.createConnection(mysql_setting);
    connection.connect();

    connection.query('select * from good_table where senderid = ? and receiverid =?',[sid,rid],
    function(error,results,fields){

        if(results[0] == undefined){
            var data = {
                'senderid':sid,
                'receiverid':rid,
                'matching':0,
            }
            connection.query('insert into good_table set ?',data,
            function(error2,results2,fields2){
                var data_judge = {
                    judge:1
                }
                res.status(200).json(data_judge);
            })            
        }else if(results[0].matching==0){
            connection.query('delete from good_table where senderid = ? and receiverid = ?',[sid,rid],
            function(error2,results2,fields2){
                var data_judge = {
                    judge:0
                }
                res.status(200).json(data_judge);
            })
        }else{
            var data_judge = {
                judge:2
            }
            res.status(200).json(data_judge);
        }
    })

    // connection.end();こいつが2回目のconnectionが終わる前に切ってしまうのでコメントアウトしておく
    

});

module.exports = router;

