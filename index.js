const config = require('config');
const mongoose = require('mongoose');
const users = require('./routes/users');
const auth = require('./routes/auth');
const projects = require('./routes/projects');
const lists = require('./routes/lists');
const tasks = require('./routes/tasks');
const express = require('express');
const cors = require('cors')
const app = express();
const http = require('http');

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

mongoose.connect('mongodb+srv://admin:qwerty123@cluster0-s1oxb.mongodb.net/task-manager?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to mongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB...', err));

app.use(express.json());
app.use(cors())
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/projects', projects);
app.use('/api/lists', lists);
app.use('/api/tasks', tasks);


// const io = require('socket.io')(app);
// io.on('connection', client => {
//   client.on('updateProject', data => { 

//    });
//   client.on('disconnect', () => { /* … */ });
// });

const server = http.createServer(app);
const port = process.env.PORT || 3000;
app.set('port', port);

server.listen(port, () => {
    console.log('Server is listening to port', app.get('port'));
});

// app.listen(port, () => console.log(`Listening on port ${port}...`)); 


let io = require('socket.io')(server);
io.sockets.on('connection', function(socket) {
    let roomId = null
    
    socket.on('connect-room', function(id) {
        console.log(id)
        roomId = id
        socket.join(id);
        io.sockets.in(roomId).emit('joined');
    })

    socket.on('update-lists', function() {
        console.log('project Lists Updated')
        io.sockets.in(roomId).emit('updated-lists');
    })
    socket.on('update-list', function(listId) {
        console.log('Project list ', listId, ' updated')
        io.sockets.in(roomId).emit('updated-list', listId);
    })
})

// const room = require('./socket/room_namespace.js');
// room.createNameSpace(io);	
