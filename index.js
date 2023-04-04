//Npm packages
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config();

//packages within our repo
const projects = require('./routes/projects');
const users = require('./routes/users');
const {User} = require('./models/user')
const {Project} = require('./models/project')


const app = express();


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...' + err));


app.use(express.json());
app.use('/api/projects', projects);
app.use('/api/users', users);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

