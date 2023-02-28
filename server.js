var express = require("express");
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var routerapi = require('./router/routerapi');

const PORT = process.env.PORT || 4200;

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyParser.json());

app.use(express.static('APP'));

var path = __dirname + '/'

//manejador de rutasS
router.use(function (req,res,next) {
  /*
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');
      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name, pplication/json');
        // Set to true if you need the website to include cookies in the requests sent
      res.setHeader('Access-Control-Allow-Credentials', true);
*/
  
  next();
});

app.get("/",function(req,res){
	res.sendFile(path + 'index.html');
}); 

//Router de las solicitudes a Express-POS
app.use('/api', routerapi);

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "APP/views/404.html");
});


http.listen(PORT, function(){
  console.log('listening on *:' + PORT);
});


io.on('connection', function(socket){
	socket.on('chat', function(msg,user){
	  io.emit('chat', msg, user);
	});
});

