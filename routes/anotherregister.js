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
        form: {name:'',email:'',profile:'',experience:'',fromcompany:'',tocompany:'',loadmap:''}
    }
    res.render('anotherregister',data);
});


router.post('/',[
    check('name','お名前は必ず入力してください。').not().isEmpty(),
    check('email','メールアドレスは必ず入力してください').isEmail(),
    check('pass','パスワードは必ず入力してください').not().isEmpty(),
    check('profile','プロフィールは必ず入力してください。').not().isEmpty(),
    check('experience','経験談は必ず入力してください').not().isEmpty(),
    check('fromcompany','以前勤めていた会社は必ず入力してください').not().isEmpty(),
    check('tocompany','今勤めている会社は必ず入力してください').not().isEmpty(),
    check('loadmap','ロードマップは必ず入力してください').not().isEmpty(),
    check('date','ロードマップの日時は必ず入力してください').not().isEmpty(),
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

            res.render('anotherregister',data);
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
                                    var pro = req.body.profile;
                                    var ex = req.body.experience;
                                    var fc = req.body.fromcompany;
                                    var tc = req.body.tocompany;
                                    var lo = req.body.loadmap;
                                    var da = req.body.date;

                                    var data = {'name':nm,'email':ml,'pass':ps,'kanri_flg':0,'life_flg':1,'status':1};

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
                                                                                        'profile':pro,
                                                                                        'experience':ex,
                                                                                        'fromcompany':fc,
                                                                                        'tocompany':tc,
                                                                };

                                                                //Userinfoテーブルに登録する
                                                                connection.query('insert into userinfo_table set ?', data_userinfo,
                                                                                function(error3, results3, fields3){

                                                                                    data_loadmap={'userid':results2[0].id,'actioncontents':lo,'actiondate':da}

                                                                                    //loadmapテーブルに登録する
                                                                                    connection.query('insert into loadmap_table set ?', data_loadmap,
                                                                                    function(error4, results4, fields4){

                                                                                        req.session.login = results2[0];

                                                                                        res.redirect('/home')
                                                                                    })
                                                                                    

                                                                })
                                                            }
                                        })

                                    })

                                }
})
}

})

module.exports = router;
