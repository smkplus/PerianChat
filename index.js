var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
const mongo = require('mongodb').MongoClient;

const dbName = 'chat';

// mongodb+srv://smkplus3d:!qazxsw2@cluster0-rporp.mongodb.net/test?retryWrites=true
mongo.connect('mongodb+srv://smkplus3d:!qazxsw2@cluster0-rporp.mongodb.net/test?retryWrites=true',{ useNewUrlParser: true }, function(err, client){
  if(err){
    throw err;
  }
  
  const db = client.db(dbName);
  
  console.log('MongoDB connected...');
  
  
  
    io.on('connection', function(socket){
      io.emit('Init');
      db.collection('chatData').find().forEach( function(chat) {
        io.emit('Test', chat);
        console.log(chat.message);
      });
      socket.on('chat message', function(msg){
        io.emit('chat message', msg);
        var name = msg.userName;
        var message = msg.message;
        db.collection('chatData').insertOne( { name,message} );
      });
    });
  });


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/chat.html', function(req, res){
  res.sendFile(__dirname + '/chat.html');
})

http.listen(port, function(){
  console.log('listening on *:' + port);
});

