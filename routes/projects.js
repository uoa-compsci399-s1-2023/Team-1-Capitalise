const express = require('express');
const mongoose = require('mongoose');
const {Project, validate} = require('../models/project');
const {User} = require('../models/user');
const router = express.Router();

router.get('/', async (req, res) => {
    const projects = await Project.find().sort('name');
    res.send(projects);
  });


router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send('Invalid user.');
  
    let project = new Project({
        name: req.body.name,
        semester: req.body.semester,
        repoLink: req.body.repoLink,
        members: {
            _id: user._id,
            name: user.name
          },
        content: req.body.content,
        likes: 0,
        badges: req.body.badges,
        tags: req.body.tags
    });

    project = await project.save();
    
    res.send(project);
  });


  //This put call appends a user to a project. It is not great.

  router.put('/:id/:userid', async (req, res) => {
  
    const user = await User.findById(req.params.userid);
    if (!user) return res.status(400).send('Invalid user.');

    const project = await Project.findByIdAndUpdate(req.params.id,
        { 
            $push: {members: user}
        }, { new: true });
    
      if (!project) return res.status(404).send('The project with the given ID was not found.');
      
      res.send(project);
  });
  
module.exports = router;