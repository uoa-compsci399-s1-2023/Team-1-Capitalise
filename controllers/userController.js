const { User, validate } = require('../models/user');
const { Project } = require('../models/project');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


//Gets all users and sorts by name
const getAllUsers = async (req, res) => {
  //Added populate method to dynamically fetch information of project document!
  const users = await User.find().populate('project', '_id, name').sort('name');
  res.send(users);
}

//Get user by username
const getUserByName = async (req, res) => {
  const { username } = req.params

  const user = await User.findOne({ username: username }).populate('project', '_id, name');
  if (!user) {
    return res.status(404).json({ fail: `no user with ${username} found` })
  }

  res.send(user);
}

//Get user by Id
const getUserById = async (req, res) => {
  const { id } = req.params

  const username = await User.findOne({ _id: id }).populate('project', '_id, name');
  if (!username) {
    return res.status(404).json({ fail: `no user with ${id} found` })
  }

  res.send(username);
}



//Adds new user
const postUser = async (req, res) => {
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
        _id: project._id
      },
      bio: req.body.bio,
      likedProjects: [],
      myComments: [],
      userType: req.body.userType
    });

    //Append user to project's members 
    const appendToProject = await Project.findByIdAndUpdate(project._id,
      {
        $push: { members: user }
      }, { new: true });

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
}

//updates the user details besides the user type
//This method also assumes that if a user doesn't update a field
//The front end form sent will send the user.<parameter> default value 
const updateUserDetails = async (req, res) => {
  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ err: "Wrong type of id " });
}

  const user = await User.findById(id)
  if (!user) {
      return res.status(404).json({ err: "No user found" });
  }

  //look through request body. Also assumes frontend will only give vistor or graduate options
  // to visitor and only admin can update a user and give them admin userType
  //For now, no authorization
  const {name, password, email, username, userType} = req.body;
  const encrypted = await bcrypt.hash(password, 10);
  var updateUser;
  if(userType != 'admin'){
    updateUser = await User.findByIdAndUpdate(id, {name: name, password: encrypted, email : email, username:username, userType : userType})
  }

  else{
    updateUser = await User.findByIdAndUpdate(id, {name: name, password: encrypted, email : email, username:username})
  }
 

 res.send(updateUser)
}

//Need to properly test
const deleteUserById = async (req, res) => {
  const {id} = req.params
  const user = await User.findOne({_id : id});
 

  
  if(user == null){
    return res.send({noUser: `User with id ${id} not found`})
  }
  const username = user.username
  const projectId = await user.project
  
  if(projectId != null){
    const findProject = await Project.findByIdAndUpdate(projectId, {$pull : {members : id}})
  }

  const removeUser = await User.findByIdAndDelete(id);
  res.send({removed: `${username} removed`});


}




//Check if the user input matches the hash. Is it safe to send this as a GET request? I'm not sure...
const comparePassWithHash = async (req, res) => {
  //Grab user from username
  const { username } = req.params
  console.log(username)
  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(404).json({ fail: `no user with ${username} found` })
  }

  //
  bcrypt.compare(req.params.plaintextpass, user.password, function(err, result) {
    res.send(result);
});
}

module.exports = {
  getAllUsers,
  getUserByName,
  getUserById,
  postUser,
  updateUserDetails,
  comparePassWithHash,
  deleteUserById,
}