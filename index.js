const express = require('express');
const mongoose = require('mongoose');
const projects = require('./routes/projects');
const users = require('./routes/users');
const {User} = require('./models/user')
const {Project} = require('./models/project')
const bcrypt = require('bcrypt');


const app = express();


mongoose.connect('mongodb+srv://leng510:xQFyCCkDZXhsKB69@capitalise.iwoisi5.mongodb.net/test')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...' + err));

app.use(express.json());
app.use('/api/projects', projects);
app.use('/api/users', users);

async function createUser(name, email, username, pass, admin ) { 
    let password = await bcrypt.hash(pass, 10);
    const user = new User({
      name, 
      email,
      username,
      password,
      admin
    });
  
    const result = await user.save();
    console.log(result);
  }

 async function createProject(name, semester, year, userId, content, likes) { 
    const project = new Project({
      name, 
      semester,
      year,
      userId,
      content,
      likes
    });
  
    const result = await project.save();
    console.log(result);
  }

  //createUser("Lucas Eng", "leng510@aucklanduni.ac.nz", "leng510", "test", false);
  //createProject("Test Project", "S2", 2023, ["6422b472ed262bce05ed25eb"], {tab: {photo: "https://preview.redd.it/help-me-find-the-origin-of-this-damn-dog-ive-looked-up-like-v0-zj7m5n0a2xx91.jpg?auto=webp&s=5f8f63acf583cf94e8e558f07e0d89ef6bf3d0f6"}} , 0);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

