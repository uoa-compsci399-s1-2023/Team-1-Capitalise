const express = require("express");
const router = express.Router();

//Grabs auth and admin functions from the middleware (for Authorization)
const { auth } = require("../middleware/auth");
const admin = require("../middleware/admin");
const graduate = require("../middleware/graduate");

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
  writeComment,
  likeComment,
  deleteComment,
  incrementViews,
  getAllComments,
  getCommentsByProjectId,
  awardBadge,
  getAwardedProjectByLatestSemester,
  getFrontPageHeadlines,
  removeUserFromProject
} = require("../controllers/projectController");

//Need to add more projects to properly test this
router.get("/search", searchProjects);

//Need to add more projects to properly test this
router.get("/likes", getProjectsByLikes);

//Get lates awarded projects (semester)
router.get("/awardedProjects", getAwardedProjectByLatestSemester);     

//Get all projects
router.get("/frontPage", getFrontPageHeadlines);    

//Get all projects
router.get("/", getAllProjects);              

//Find a project by id
router.get("/:projectId", getProject);        

//Add new project. Requires authorization.
router.post("/", [auth, graduate], addNewProject);

//Increments the view counter of a page
router.patch("/:projectId/incrementViews", incrementViews);

//Writes a comment. Appends it to the relevant user and project.
router.post("/comment", auth, writeComment);

//Get all projects
router.get("/comments/all", getAllComments);

//Get all comments by projectId
router.get("/comments/:projectId", getCommentsByProjectId);

//Delete a comment. Removes comment from relevant user and project.
router.delete("/comment/:commentId", auth, deleteComment);

//Create a route that likes or unlikes a project
router.patch("/:projectId/like", auth, likeComment);

//Update a project
router.patch("/:projectId", [auth, graduate], updateProjectById);

//This put call appends a user to a project. It is not great.
router.put("/:id/:userid", [auth, graduate], addUserToProject);


//Delete the project. Will carry out general authorization first, before admin authorization.
router.delete("/:projectId", [auth, admin], deleteProject);

//Adds a badge to a project
router.patch("/badges/award", [auth, admin], awardBadge);

//Get projects with :badge whatever
router.get("/badges/:badge", getProjectByBadge);

//This PATCH call pulls a user from a project.
router.patch('/removeUser/:projectId/:id', auth, removeUserFromProject);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////








module.exports = router;
