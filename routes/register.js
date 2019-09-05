var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var {check, validationResult} = require('express-validator');
var bcrypt = require('bcrypt');


var mysql_setting = {
    host : 'localhost',
    user : 'root',
    password : '******',
    database : '******',
}


router.get('/',(req,res) => {
    var data = {
        content:'',
        form: {name:'',email:''}
    }
    res.render('register',data);
});


router.post('/',[
    check('name','お名前は必ず入力してください。').not().isEmpty(),
    check('email','メールアドレスは必ず入力してください').isEmail(),
    check('pass','パスワードは必ず入力してください').not().isEmpty(),
],(req,res) => {

    var result = validationResult(req);
        if(!result.isEmpty()){
            var re = '<ul class="error">';
            var result_error = result.array();
            
            for (var n in result_error){
                re += '<li>'+result_error[n].msg + '</li>'
            }

            re += '</ul>';

            var data = {
                content:re,
                form:req.body
            }

            res.render('register',data);
        }else {

            var ml = req.body.email;

            var connection =mysql.createConnection(mysql_setting);
            connection.connect();

            //同じアドレスがないか調べる
            connection.query('SELECT * from user_table where email = ?',ml,
                            function(error,results,fields){
                                if(results[0] !== undefined){
                                    var data = {
                                        content:'<p class="error">入力されたメールアドレスは既に使われています。</p>',
                                        form:req.body
                                    };
                                    res.render('register',data); 
                                }else{
                                    var nm = req.body.name;
                                    var ps = bcrypt.hashSync(req.body.pass,10);

                                    var data = {'name':nm,'email':ml,'pass':ps,'kanri_flg':0,'life_flg':1,'status':0};

                                    //まず個人情報を新規登録する
                                    connection.query('insert into user_table set ?',data,
                                                    function(error1,results1,fields1){

                                                        //登録したuser_tableのIDをuserinfo_tableのIDとして登録するためIDを取り出す
                                                        connection.query('SELECT * from user_table where email =?',ml,
                                                                        function(error2,results2,fields2){
                                                                            if(error2==null){
                                                                                var data_userinfo = {'userid':results2[0].id,
                                                                                                        'icon':'default_icon.png',
                                                                                                        'backgroundpic':'default_backgroundpic.jpg',
                                                                                                        'profile':'profileはまだ入力されていません',
                                                                                                        'experience':'経験はまだ入力されていません',
                                                                                                        'fromcompany':'昔いた会社はまだ入力されていません',
                                                                                                        'tocompany':'今いる会社はまだ入力されていません',
                                                                                                    };

                                                                                //Userinfoテーブルに登録する
                                                                                connection.query('insert into userinfo_table set ?', data_userinfo,
                                                                                                function(error3, results3, fields3){
                                                                                                    req.session.login = results2[0];
                     
                                                                                                        res.redirect('/home')
                                                                                                    

                                                                                                })
                                                                            }
                                                                        })

                                                    })

                                }
                            })
        }
    
})

module.exports = router;