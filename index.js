const config = require('config');
const mongoose = require('mongoose');
const users = require('./routes/users');
const auth = require('./routes/auth');
const projects = require('./routes/projects');
const lists = require('./routes/lists');
const tasks = require('./routes/tasks');
const express = require('express');
const app = express();

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

mongoose.connect('mongodb+srv://admin:qwerty123@cluster0-s1oxb.mongodb.net/task-manager?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to mongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB...', err));

app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/projects', projects);
app.use('/api/lists', lists);
app.use('/api/tasks', tasks);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`)); 