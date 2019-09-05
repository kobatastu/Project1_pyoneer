var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var mysql_setting = {
    host : 'localhost',
    user : 'root',
    password : '*****',
    database : '*****',
}

router.get('/',(req,res) => {
    if(req.session.login == null){
       res.redirect('/error');
    }else{

        var connection =mysql.createConnection(mysql_setting);
        connection.connect();

        connection.query('SELECT * from (SELECT * from good_table WHERE senderid = ?) AS good_table RIGHT OUTER JOIN user_table ON good_table.receiverid = user_table.id INNER JOIN userinfo_table ON user_table.id = userinfo_table.userid where life_flg =? and status =? and userid !=?',
                        [req.session.login.id,1,1,req.session.login.id],
                        function(error,results,fields){

                         

                            
                            if(error==null){
                                var data = {
                                    results:results,
                                    kanri:req.session.login.kanri_flg
                                }
                                
                                res.render('home',data);
                            }
                        });
        connection.end();
    
    }
});

router.get('/load',(req,res)=>{

    var rid = req.query.rid;

    var connection =mysql.createConnection(mysql_setting);
    connection.connect();

    var data = {};

    var promise = new Promise((resolve,reject)=>{
        connection.query('select * from loadmap_table where userid = ? ORDER BY actiondate',rid,
        function(error,results,fields){

           
            
                for(var i=0;i<results.length;i++){
                    var name = 'no' + i
                    data[name] = {
                        cont:results[i].actioncontents,
                        date:results[i].actiondate
                    }               
                }
                resolve();
        })
    });

    promise.then(()=>{
        res.status(200).json(data)
    })
    // connection.end();こいつが2回目のconnectionが終わる前に切ってしまうのでコメントアウトしておく
});

router.post('/',(req,res) => {
    if(req.session.login == null){
       res.redirect('/error');
    }else{

        var word = req.body.search;

     


        var connection =mysql.createConnection(mysql_setting);
        connection.connect();

        connection.query('SELECT * from (SELECT * from good_table WHERE senderid = ?) AS good_table RIGHT OUTER JOIN user_table ON good_table.receiverid = user_table.id INNER JOIN userinfo_table ON user_table.id = userinfo_table.userid where life_flg =? and status =? and userid !=? and experience like "%'+word+'%" ',
                        [req.session.login.id,1,1,req.session.login.id],
                        function(error,results,fields){

                        
                          
                            if(error==null){
                                var data = {
                                    results:results,
                                    kanri:req.session.login.kanri_flg
                                }
                                res.render('home',data);
                            }
                        });
        connection.end();
    
    }
});

module.exports = router;