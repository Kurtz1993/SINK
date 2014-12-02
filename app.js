var express = require('express');
var path 		= require('path');
var http 		= require('http').Server(app);
var io 			= require('socket.io')(http);
var app 		= express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res){
  res.render('index');
});

app.get('/client', function(req, res){
	res.render('client');
});

io.on('connection', function(socket){
  socket.on('chat', function(msg){
    io.emit('chat', msg);
    io.emit('graph', 'test');
  });
});

app.listen(3000, function(){
  console.log('listening on *:3000');
});
