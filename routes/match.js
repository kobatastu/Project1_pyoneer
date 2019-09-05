var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var mysql_setting = {
    host : 'localhost',
    user : 'root',
    password : '*****',
    database : '******',
}

router.get('/',(req,res)=>{

    var sid = req.session.login.id;
    var status = req.session.login.status;

        var connection =mysql.createConnection(mysql_setting);
        connection.connect();

        if(status==1){
            var identity = 'receiverid'
            var factor = 'senderid'
        }else{
            var identity = 'senderid'
            var factor = 'receiverid'
        }

       
        var data1 = {}
        var data2 = {}
        // var data = {'user':status}

        var promise1 = new Promise((resolve,reject)=>{

            connection.query('SELECT * from user_table INNER JOIN userinfo_table ON user_table.id = userinfo_table.userid RIGHT OUTER JOIN good_table ON user_table.id = good_table.senderid where receiverid =?',sid,
            function(error,results,fields){

              

                for(var i=0;i<results.length;i++){
                    var name = 'no' + i
                    data1[name] = results[i]; 
                }           
                resolve();

            })
        })

        var promise2 = new Promise((resolve,reject)=>{

            connection.query('SELECT * from user_table INNER JOIN userinfo_table ON user_table.id = userinfo_table.userid RIGHT OUTER JOIN good_table ON user_table.id = good_table.receiverid where senderid =?',sid,
            function(error,results,fields){

              

                for(var i=0;i<results.length;i++){
                    var name = 'no' + i
                    data2[name] = results[i]; 
                }           
                resolve();

            })
        })

        promise1.then(()=>{
            promise2.then(()=>{
                data = {'forme':data1,'foryou':data2}
                res.status(200).json(data)
            })
        })
})

router.get('/matching',(req,res)=>{

    var sid = req.session.login.id;
    var rid = req.query.rid;
  
    var connection =mysql.createConnection(mysql_setting);
    connection.connect();


    connection.query('select * from good_table where senderid = ? and receiverid =?',[rid,sid],
    function(error,results,fields){

        if(results[0].matching==0){

            data = { 'matching':1}

            connection.query('update good_table set ? where id=?',[data,results[0].id],
            function(error2,results2,fields2){
                var data_judge = {
                    judge:1
                }
                res.status(200).json(data_judge);
            })            
        }else{
            var data_judge = {
                judge:1
            }
            res.status(200).json(data_judge);
        }
    })


})

module.exports = router;