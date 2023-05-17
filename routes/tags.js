const express = require("express");
const router = express.Router();

//Grabs auth and admin functions from the middleware (for Authorization)
const { auth } = require("../middleware/auth");
const admin = require("../middleware/admin");
const graduate = require("../middleware/graduate");
const {
    getAllTags,
    postNewTag,
    searchTag,
    addTagToProject,
    deleteTag,
    deleteTagFromProject,
    getTagByNameOrId
} = require("../controllers/tagController")

//Get all tags in no order
router.get('/', getAllTags)



//Search for a tag
router.get('/search', searchTag)

//Gets tag via tagName
router.get('/:tagName', getTagByNameOrId)


//Add new tag to tags in mongoDb
router.post('/:tagName', [auth, graduate], postNewTag)

//Post a new tag which requires a project to have that tag
router.post('/:tagName/:projectId', [auth, graduate], postNewTag)

//Patch add a tag to a project
router.patch('/:tagName/:projectId', [auth, graduate], addTagToProject)

//Deletes the tag from db and removes the tag from all projectstag
router.delete('/:tagName', [auth, admin], deleteTag)

//Delete a tag in a project 
router.delete('/:tagName/:projectId', [auth, graduate], deleteTagFromProject)

module.exports = router

