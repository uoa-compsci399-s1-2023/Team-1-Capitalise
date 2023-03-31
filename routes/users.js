const express = require('express');
const mongoose = require('mongoose');
const {User, validate} = require('../models/user');
const {Project} = require('../models/project');
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    const users = await User.find().sort('name');
    res.send(users);
  });


router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    let user = "";
    let password = await bcrypt.hash(req.body.password, 10);

    if (req.body.projectId) {
      const project = await Project.findById(req.body.projectId);
      if (!project) return res.status(400).send('Invalid project.');

      user = new User({ 
        name: req.body.name, 
        email: req.body.email,
        username: req.body.username,
        password: password,
        github: req.body.github,
        linkedin: req.body.linkedin,
        project: {
          _id: project._id,
          projectName: project.name
        },
        bio: req.body.bio,
        likedProjects: [],
        myComments: [],
        userType: req.body.userType
      });
    } else {
      user = new User({ 
        name: req.body.name, 
        email: req.body.email,
        username: req.body.username,
        password: password,
        github: req.body.github,
        linkedin: req.body.linkedin,
        bio: req.body.bio,
        likedProjects: [],
        myComments: [],
        userType: req.body.userType
      });

    }

  

    user = await user.save();
    
    res.send(user);
  });
  




module.exports = router;