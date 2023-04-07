const express = require('express');
const router = express.Router();

//Grabs auth and admin functions from the middleware (for Authorization)
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
  searchProjects,
  writeComment
} = require('../controllers/projectController')

//Get all projects
router.get('/', getAllProjects);

//Add new project. Requires authorization. 
router.post('/', auth, addNewProject);

//Need to add more projects to properly test this
router.get('/likes', getProjectsByLikes)

//Need to add more projects to properly test this
router.get('/search/:keyword/:semester/:year/:award/:tags', searchProjects)

//Find a project by id
router.get('/:projectId', getProject);

//Update a project
router.patch('/:projectId', auth, updateProjectById)

//Delete the project. Will carry out general authorization first, before admin authorization. 
router.delete('/:projectId', [auth, admin], deleteProject)

//Get projects with :badge whatever
router.get('/badges/:badge', getProjectByBadge);

//This put call appends a user to a project. It is not great.
router.put('/:id/:userid', auth, addUserToProject);

//Writes a comment. Appends it to the relevant user and project. 
router.post('/comment', auth, writeComment);



module.exports = router;