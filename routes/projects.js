const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const {
  getAllProjects,
  getProjectsByLikes,
  getProjectByBadge,
  getProject,
  updateProjectById,
  addNewProject,
  addUserToProject,
  deleteProject,
  searchProjects
} = require('../controllers/projectController')

//Get all projects
router.get('/', getAllProjects);

//Add new project
router.post('/', auth, addNewProject);

//Need to add more projects to properly test this
router.get('/likes', getProjectsByLikes)

//Need to add more projects to properly test this
router.get('/search/:keyword/:semester/:year/:award/:tags', searchProjects)
  
//Find a project by id
router.get('/:projectId', getProject);

//Update a project
router.patch('/:projectId', auth, updateProjectById)

//Delete the project
router.delete('/:projectId', [auth, admin], deleteProject)

//Get projects with :badge whatever
router.get('/badges/:badge', getProjectByBadge);

//This put call appends a user to a project. It is not great.
router.put('/:id/:userid', auth, addUserToProject);


  
module.exports = router;