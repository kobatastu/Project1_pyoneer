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

    var sid = req.session.login.id;
  
    var connection =mysql.createConnection(mysql_setting);
    connection.connect();

    var data = {};

    var promise = new Promise((resolve,reject)=>{
        connection.query('select * from loadmap_table where userid = ? ORDER BY actiondate',sid,
        function(error,results,fields){
            
                for(var i=0;i<results.length;i++){
                    var name = 'no' + i
                    data[name] = {
                        id:results[i].id,
                        cont:results[i].actioncontents,
                        date:results[i].actiondate
                    }               
                }
                resolve();
        })
    });

    promise.then(()=>{
        res.status(200).json(data)
    }
    )
    // connection.end();こいつが2回目のconnectionが終わる前に切ってしまうのでコメントアウトしておく
});

router.post('/',(req,res)=>{

    var sid = req.session.login.id;
    var cont = req.body.cont;
    var date = req.body.date;

  
    var connection =mysql.createConnection(mysql_setting);
    connection.connect();

    var data = {
        'userid':sid,
        'actioncontents':cont,
        'actiondate':date
    }

    connection.query('insert into loadmap_table set ?',data,
    function(error,results,fields){
        res.redirect('/mypage');
    })

})

router.get('/delete',(req,res)=>{

    var did = req.query.did;
  
    var connection =mysql.createConnection(mysql_setting);
    connection.connect();

    connection.query('delete from loadmap_table where id = ?',did,
    function(error,results,fields){
        
        res.redirect('/mypage');

    })
   

    connection.end();
});

module.exports = router;