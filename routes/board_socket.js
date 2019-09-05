var express = require('express');
var router = express.Router();
var http = require('http');
var mysql = require('mysql');
require('date-utils');

var mysql_setting = {
    host : 'localhost',
    user : 'root',
    password : '******',
    database : '*******',
}

var server = http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end('finish')
})

var io = require('socket.io').listen(server);

server.listen(8080);

var connection =mysql.createConnection(mysql_setting);
connection.connect();


// 接続確立後の通信処理部分を定義
io.on('connection', function(socket){
// クライアントからサーバーへ メッセージ送信ハンドラ（自分を含む全員宛に送る）
  socket.on('chat message', function(value){
  
    //データベースに送るためのデータを作成
    var dt = new Date();
    dt.setHours(dt.getHours() + 9);
    var date = dt.toFormat("YYYY-MM-DD HH24:MI:SS"); 
    var data = {'name':value.name,'msg':value.msg,'date':date}

    //データベースに送る
    connection.query('insert into board_table set ?',data,
    function(error,results,fields){
  
        // サーバーからクライアントへ メッセージを送り返し
        io.emit('chat message', data);
    })
    
  });
});



module.exports = router;