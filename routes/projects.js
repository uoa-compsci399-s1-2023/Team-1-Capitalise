const express = require('express');
const router = express.Router();

const {
  getAllProjects,
  getProjectsByLikes,
  getProjectByBadge,
  getProject,
  updateProjectById,
  addNewProject,
  addUserToProject,
  deleteProject,
} = require('../controllers/projectController')

//Get all projects
router.get('/', getAllProjects);

//Add new project
router.post('/', addNewProject);

//Need to add more projects to properly test this
router.get('/likes', getProjectsByLikes)
  
//Find a project by id
router.get('/:projectId', getProject);

//Update a project
router.patch('/:projectId', updateProjectById)

//Delete the project
router.delete('/:projectId', deleteProject)

//Get projects with :badge whatever
router.get('/badges/:badge', getProjectByBadge);

//This put call appends a user to a project. It is not great.
router.put('/:id/:userid', addUserToProject);
  
module.exports = router;