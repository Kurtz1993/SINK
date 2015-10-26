import express 	= require('express');
import path 		= require('path');
var app 				= express();
var http 				= require('http').Server(app);
var io 					= require('socket.io')(http);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
	res.render('sink');
});

app.get('/client', (req, res) => {
	res.render('client');
});

io.on('connection', (socket:SocketIO.Socket) => {
	console.log('A new robot has arrived!');
	socket.on('data', (msg:any) => {
		io.emit('graph', msg);
	});
});

io.on('disconnection', (socket:SocketIO.Socket) => {
	console.log('A robot has left');
});

http.listen(3000, () => {
	console.log('listening at 127.0.0.1:3000');
});
