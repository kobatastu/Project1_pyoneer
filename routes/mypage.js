var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var {check, validationResult} = require('express-validator');
require('date-utils');
var path = require('path');
var fs = require('fs');

var mysql_setting = {
    host : 'localhost',
    user : 'root',
    password : '*****',
    database : '******',
}


router.get('/',(req,res)=>{

    //session変数を持っていない場合はエラーページに飛ぶ
    if(req.session.login == null){
        res.redirect('/error');
     }else{

        var connection =mysql.createConnection(mysql_setting);
        connection.connect();

        connection.query('SELECT * from userinfo_table where userid = ?',req.session.login.id,
                        function(error, results, fields){
                            if(error==null){
                               
                                var data = {
                                    name:req.session.login.name,
                                    icon: results[0].icon,
                                    backgroundpic: results[0].backgroundpic,
                                    profile: results[0].profile,
                                    experience: results[0].experience,
                                    fromcompany: results[0].fromcompany,
                                    tocompany: results[0].tocompany
                                }
                                res.render('mypage',data)
                            }
                        })

        connection.end();
    }
})

router.post('/',(req,res)=>{

    var id = req.session.login.id;
    var now = new Date();
    var time = now.toFormat('YYYYMMDDHH24MISS')

    var pr = req.body.profile;
    var ex = req.body.experience;
    var fr = req.body.fromcompany;
    var to = req.body.tocompany;
    var ic = req.body.icon;
    var ba = req.body.backgroundpic;

    var connection =mysql.createConnection(mysql_setting);
    connection.connect();


    if(req.files==null){

        var data = {'icon':ic,'backgroundpic':ba,'profile':pr,'experience':ex,'fromcompany':fr,'tocompany':to};
                    
        connection.query('update userinfo_table set ? where userid = ?',[data,id],
        function(error,results,fields){
            res.redirect('/mypage')
        })

        connection.end();

    }else if(req.files.icon==undefined){

        var bg_ext = path.extname(req.files.backgroundpic.name);
        var new_bgname = time+req.files.backgroundpic.md5+bg_ext;

        var target_path_g = 'public/img/upload_backgroundpic/'+new_bgname;

        fs.writeFile(target_path_g, req.files.backgroundpic.data,(err)=>{
            if(err){
                throw err
            }else{
                var data = {'icon':ic,'backgroundpic':new_bgname,'profile':pr,'experience':ex,'fromcompany':fr,'tocompany':to};
                
                connection.query('update userinfo_table set ? where userid = ?',[data,id],function(error,results,fields){
                    res.redirect('/mypage')
                })
    
                connection.end();

            }
        });

    }else if(req.files.backgroundpic==undefined){

        var icon_ext = path.extname(req.files.icon.name);
        var new_iconname = time+req.files.icon.md5+icon_ext;

        var target_path_i = 'public/img/upload_icon/'+new_iconname;

        fs.writeFile(target_path_i, req.files.icon.data,(err) => {
            if(err){
                throw err
            }else{

                var data = {'icon':new_iconname,'backgroundpic':ba,'profile':pr,'experience':ex,'fromcompany':fr,'tocompany':to};
                
                connection.query('update userinfo_table set ? where userid = ?',[data,id],function(error,results,fields){
                    res.redirect('/mypage')
                })
    
                connection.end();

            }
        });

    } else {
        var icon_ext = path.extname(req.files.icon.name);
        var new_iconname = time+req.files.icon.md5+icon_ext;

        var bg_ext = path.extname(req.files.backgroundpic.name);
        var new_bgname = time+req.files.backgroundpic.md5+bg_ext;


        var target_path_i = 'public/img/upload_icon/'+new_iconname;
        var target_path_g = 'public/img/upload_backgroundpic/'+new_bgname;

        fs.writeFile(target_path_i, req.files.icon.data,(err) => {
            if(err){
                throw err
            }else{
                fs.writeFile(target_path_g, req.files.backgroundpic.data,(err)=>{
                    if(err){
                        throw err
                    }else{
                        var data = {'icon':new_iconname,'backgroundpic':new_bgname,'profile':pr,'experience':ex,'fromcompany':fr,'tocompany':to};
                        
                        connection.query('update userinfo_table set ? where userid = ?',[data,id],function(error,results,fields){
                            res.redirect('/mypage')
                        })
            
                        connection.end();

                    }
                });
            }
        });
    }

})

router.get('/ajax',(req,res)=>{
  
    var connection =mysql.createConnection(mysql_setting);
    connection.connect();

    connection.query('SELECT * from userinfo_table where userid = ?',req.session.login.id,
                        function(error, results, fields){
                            if(error==null){

                                var data = {
                                    profile: results[0].profile,
                                    experience: results[0].experience,
                                    fromcompany: results[0].fromcompany,
                                    tocompany: results[0].tocompany
                                }
                                res.status(200).json(data);
                            }
                        })

    connection.end();

})

router.get('/status',(req,res)=>{

    var sta = req.session.login.status;
    data = {status:sta};
    res.status(200).json(data);

})

router.get('/pyoneer',(req,res)=>{
  
    var connection =mysql.createConnection(mysql_setting);
    connection.connect();

    var data ={};

    var promise1 = new Promise((resolve,reject)=>{

        connection.query('SELECT * from userinfo_table where userid = ?',req.session.login.id,
                        function(error, results, fields){
                            if(error==null){
                                if(results[0].profile=='profileはまだ入力されていません'){
                                    data.profile='profile'
                                }
                                if(results[0].experience=='経験はまだ入力されていません'){
                                    data.experience='experience'
                                }                                
                                if(results[0].fromcompany=='昔いた会社はまだ入力されていません'){
                                    data.fromcompany='fromcompany'
                                }
                                if(results[0].tocompany=='今いる会社はまだ入力されていません'){
                                    data.tocompany='tocompany'
                                }
                                resolve();
                            }
                        })
    })

    var promise2 = new Promise((resolve,reject)=>{

        connection.query('SELECT * from loadmap_table where userid = ?',req.session.login.id,
                    function(error, results, fields){
                        if(error==null){
                           
                            if(results[0]==null){
                                data.loadmap='roadmap'
                            }
                            resolve();

                        }
                    })
    })



    promise1.then(()=>{
        promise2.then(()=>{
            console.log(data);
            if(Object.keys(data).length == 0){

                console.log('ここ通ってる？')

                data1 = {"status":1}

                connection.query('Update user_table set ? where id = ?',[data1,req.session.login.id],
                function(error,results,fields){

                    req.session.login.status=1;
                    res.status(200).json(data)

                })
            }else{
                res.status(200).json(data)

            }
            
        })
    })
    // connection.end();

})

module.exports = router;