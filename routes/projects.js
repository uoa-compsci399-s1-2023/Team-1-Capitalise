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
        year: req.body.year,
        members: {
            _id: user._id,
            name: user.name
          },
        content: {
          tab: {
            photo: "https://preview.redd.it/help-me-find-the-origin-of-this-damn-dog-ive-looked-up-like-v0-zj7m5n0a2xx91.jpg?auto=webp&s=5f8f63acf583cf94e8e558f07e0d89ef6bf3d0f6"
          }
        },
        likes: 0
    });

    project = await project.save();
    
    res.send(project);
  });


  router.put('/:id/:userid', async (req, res) => {
    //const { error } = validate(req.body); 
    //if (error) return res.status(400).send(error.details[0].message);
  
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