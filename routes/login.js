var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var {check, validationResult} = require('express-validator');
var bcrypt = require('bcrypt');

var mysql_setting = {
    host : 'localhost',
    user : 'root',
    password : '*****',
    database : '*****',
}


router.get('/',(req,res)=>{
    var data = {
        content:'',
        form: {email:''}
    }
    res.render('login',data);
})

router.post('/',[
    check('email','正しいメールアドレスを入力してください').isEmail(),
    check('pass','パスワードは必ず入力してください').not().isEmpty()
],(req,res)=>{

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

        res.render('login',data);
    }else {

        var ml = req.body.email;
        var ps = req.body.pass;

        var connection =mysql.createConnection(mysql_setting);
        connection.connect();

        connection.query('SELECT * from user_table where email =?',ml,
                        function(error, results, fields){
                            if(results[0] == undefined || results[0].life_flg == 0||bcrypt.compareSync(ps,results[0].pass)!=true){
                                var data = {
                                    content:'<p class="error">メールアドレスまたはパスワードが違います。</p>',
                                    form:req.body
                                };
                                res.render('login',data); 
                            }else{
                                req.session.login = results[0];
                                res.redirect('/home');
                            }
                        })
       
    }

})

module.exports = router;