const express = require('express');
const mongoose = require('mongoose');
const projects = require('./routes/projects');
const users = require('./routes/users');
const {User} = require('./models/user')
const {Project} = require('./models/project')
const bcrypt = require('bcrypt');


const app = express();


mongoose.connect('mongodb+srv://leng510:xQFyCCkDZXhsKB69@capitalise.iwoisi5.mongodb.net/capitalise')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...' + err));

app.use(express.json());
app.use('/api/projects', projects);
app.use('/api/users', users);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

