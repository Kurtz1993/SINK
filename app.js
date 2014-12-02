var express = require('express');
var path 		= require('path');
var app 		= express();
var http 		= require('http').Server(app);
var io 			= require('socket.io')(http);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res){
  res.render('sink');
});

app.get('/client', function(req, res){
	res.render('client');
});

io.on('connection', function(socket){
	console.log('A new robot has arrived!');
	socket.on('data', function(msg){
		io.emit('graph', msg);
	});
});

io.on('disconnection', function(socket){
	console.log('A robot has left');
});

http.listen(3000, function(){
  console.log('listening at 127.0.0.1:3000');
});
