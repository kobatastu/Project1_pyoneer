var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var session = require('express-session');
var fileUpload = require('express-fileupload');

//アドレスにアクセスした時に実行するファイルをロードしておく
var index = require('./routes/index'); 
var login = require('./routes/login');
var register = require('./routes/register');
var home = require('./routes/home');
var mypage = require('./routes/mypage');
var logout = require('./routes/logout');
var error = require('./routes/error');
var good = require('./routes/good');
var loadmap = require('./routes/loadmap');
var match = require('./routes/match');
var kanri = require('./routes/kanri');
var withdraw = require('./routes/withdraw');
var board = require('./routes/board');
var board_socket = require('./routes/board_socket');
var chat = require('./routes/chat');
var chat_socket = require('./routes/chat_socket');
var anotherregister = require('./routes/anotherregister');
var contact = require('./routes/contact');
var terms = require('./routes/terms');
var select = require('./routes/select');



var app = express();
var session_opt = {
    secret:'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60*60*1000}
}

//エンジンテンプレートの設定
app.set('view engine','ejs');

app.engine('ejs',ejs.renderFile);
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session(session_opt));
app.use(fileUpload());

//特定のアドレスにアクセスした時の処理(必ずsessionの後ろに書く)
app.use('/',index);
app.use('/login',login); 
app.use('/register',register); 
app.use('/home',home); 
app.use('/mypage',mypage); 
app.use('/logout',logout); 
app.use('/error',error); 
app.use('/good',good); 
app.use('/loadmap',loadmap); 
app.use('/match',match); 
app.use('/kanri',kanri); 
app.use('/withdraw',withdraw); 
app.use('/board',board); 
app.use('/board_socket',board_socket); 
app.use('/chat',chat); 
app.use('/chat_socket',chat_socket); 
app.use('/anotherregister',anotherregister); 
app.use('/contact',contact); 
app.use('/terms',terms); 
app.use('/select',select); 

//appに色々な処理をした状態でモジュール化、次回requireで取り出した時今回の処置が保存されるようになる
module.exports = app;
app.listen(3000)