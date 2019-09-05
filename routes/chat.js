var express = require('express');
var router = express.Router();
var mysql = require('mysql');


var mysql_setting = {
    host : 'localhost',
    user : 'root',
    password : '******',
    database : '******',
}


router.get('/',(req,res)=>{

    if(req.session.login == null){
        res.redirect('/error');
     }else{

    var connection =mysql.createConnection(mysql_setting);
    connection.connect();

    connection.query('SELECT * from (SELECT id mid, senderid senderid,receiverid receiverid,matching matching From good_table WHERE matching = 1) AS good_table LEFT OUTER JOIN user_table ON good_table.senderid = user_table.id INNER JOIN userinfo_table ON user_table.id = userinfo_table.userid where receiverid = ?', req.session.login.id,
    function(error,results,fields){
        
        connection.query('SELECT * from (SELECT id mid, senderid receiverid,receiverid senderid,matching matching From good_table WHERE matching = 1) AS good_table LEFT OUTER JOIN user_table ON good_table.senderid = user_table.id INNER JOIN userinfo_table ON user_table.id = userinfo_table.userid where receiverid = ?', req.session.login.id,
        function(error2,results2,fields2){
    
            var result = results.concat(results2);
   
            data = {'status':req.session.login.status,'results':result}; //関数内でvarを宣言してしまうと関数だけの固有の値となり外部に出せない
            res.render('chat',data);
        })
    })

    // connection.query('select * from chat_table',
    // function(error,results,fields){
      

    // })
    }

})

router.get('/ajax',(req,res)=>{

    var mid = req.query.mid;

    var connection =mysql.createConnection(mysql_setting);
    connection.connect();

    var data = {};

    var promise = new Promise((resolve,reject)=>{

    connection.query('SELECT * from chat_table WHERE room = ?', mid,
    function(error,results,fields){
        
            

            for(var i=0;i<results.length;i++){
                var name = 'no' + i
                data[name] = results[i]          
            }
            resolve();
    })

    })

    promise.then(()=>{
        res.status(200).json(data)
    })

})

module.exports = router;



// connection.query('select * from user_table RIGHT OUTER JOIN good_table ON user_table.id = good_table.'+id1+' WHERE matching = 1 and '+id2+' = ?',req.session.login.id,
// function(error,results,fields){