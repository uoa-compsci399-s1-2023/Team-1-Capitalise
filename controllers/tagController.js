const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Parameter, validateParameter } = require("../models/parameter");
const { Project } = require("../models/project");
const {Tag} = require("../models/tag");
const { checkProject, checkUser} = require("./checkParamValid");


const getAllTags = async (req, res) => {
    const tags = await Tag.find()
    return res.status(200).send(tags)
}

const getTagByNameOrId = async(req, res) => {
    const {tagName} = req.params

    let tag = null
    
    //Checks if an id is sent
    try{
        tag = await Tag.findById(tagName)
        .populate({
            path: "projects",
            populate: [
            { path: "semester", select: "value -_id" },
            { path: "category", select: "value -_id" },
            { path: "badges", select: "value" },
            { path: "tags", select: "name" },
            { path: "members", select: "_id name" }
            ]
        })
        }
    catch(err){
        console.log('Not an id, but ok')
    }

    //if not by id check if its name
    if(!tag){
        tag = await Tag.findOne({name: tagName})
        .populate({
            path: "projects",
            populate: [
              { path: "semester", select: "value -_id" },
              { path: "category", select: "value -_id" },
              { path: "badges", select: "value" },
              { path: "tags", select: "name" },
              { path: "members", select: "_id name" }
            ]
          })
    }  

    //If tag is not found
    if(!tag){
        return res.status(404).send({tag: null, msg:'no tag found'})
    }
    return res.status(200).send(tag)

}

const postNewTag = async (req, res) => {
  const {tagName} = req.params;

  //Make so tag is exactly
  let searchQuery = {
    name: tagName,
  };

  const tag = await Tag.findOne(searchQuery);
  //check if tag exist already
  if (tag) {
    return res.status(400).send({ tag: null, msg: 'Tag already exists' });
  }

  let newTag = new Tag({
    name: tagName,
    projects: [],
    mentions: 0,
  });

  newTag = await newTag.save();
  return res.status(200).send(newTag);
};

const postNewTagAddToProject = async (req, res) => {
  const { projectId, tagName } = req.params;

  //Make so tag is exactly
  let searchQuery = {
    name: tagName,
  };

  const tag = await Tag.findOne(searchQuery);
  //check if tag exist already
  if (tag) {
    return res.status(400).send({ tag: null, msg: 'Tag already exists' });
  }

  //Check if there is a projectId given
  if (!(await checkProject(projectId) )) {
    return res.status(404).send({ project: null, msg: 'No project found' });
  }

  let newTag = new Tag({
    name: tagName,
    projects: [],
    mentions: 0,
  });

  newTag.projects.push({ _id: projectId });
  newTag.mentions += 1;
  await Project.findByIdAndUpdate(projectId, { $push: { tags: { _id: newTag._id } } })

  
  newTag = await newTag.save();
  const project = await Project.findById(projectId)
  .populate("members", "_id, name")
  .populate("semester", "value -_id")
  .populate("category", "value -_id")
  .populate("badges", "value -_id")
  .populate("tags", "name -_id")
    
  return res.status(200).send(project);
};

const searchTag = async (req, res) => {
    const nameQuery = req.query.name || "";

  let searchQuery = {
    name: { $regex: nameQuery, $options: "i" },
  };

  try {
    const tags = await Tag.find(searchQuery)
    .populate({
        path: "projects",
        populate: [
          { path: "semester", select: "value -_id" },
          { path: "category", select: "value -_id" },
          { path: "badges", select: "value" },
          { path: "tags", select: "name" },
          { path: "members", select: "_id name" }
        ]
      })


    return res.send(tags);

  } catch (error) {
    return res.status(500).send({ error: "Server error" });
  }


}

const addTagToProject = async (req, res) => {
    const {projectId, tagName} = req.params

    if(!(await checkProject(projectId))){
        return res.status(404).send({project:null, msg: 'no project found'})
    }

    const tag = await Tag.findOne({name : tagName})

    if(!tag){
        return res.status(404).send({tag:null, msg: 'no tag found'}) 
    }


    //if tag already includes projectId, then project should already contain the tag
    if(tag.projects.includes(projectId))
    {
        return res.status(400).send({tag: null, msg: 'tag already contains this project'})
    }

    const checkproject= await Project.findById(projectId)

    if(!(checkproject.members.includes(req.user._id)) && req.user.userType != 'admin'){
        return res.status(403).send({project: null, msg:'you are not part of this project'})
    }
    //Checks if project already has the tag
    if(checkproject.tags.includes(tag._id))
    {
        return res.status(400).send({tag: null, msg: 'project already contains this tag'})
    }

    //update the project if it doesnt have the tag and populate it
    const project = await Project.findByIdAndUpdate(projectId, {$push: {tags: tag}}, { new: true })
    .populate("members", "_id, name")
    .populate("semester", "value -_id")
    .populate("category", "value -_id")
    .populate("badges", "value")
    .populate("tags", "name")

    //Add the projectId to the tag
    tag.projects.push(projectId)
    tag.mentions += 1
    
    await tag.save()

    return res.status(200).send({tag: tag, project: project})
}


const deleteTagFromProject = async(req, res) => {
    const {tagName, projectId} = req.params
    const tag = await Tag.findOne({name: tagName})
    
    //Check if tag exist
    if(!tag){
        return res.status(404).send({tag:null, msg: 'no tag found'}) 
    }

    //Check if project exist
    if(!(await checkProject(projectId))){
        return res.status(404).send({project:null, msg: 'no project found'})
    }

    //update project and populate it with data
    const project = await Project.findByIdAndUpdate(projectId, {$pull: {tags: tag._id}}, {new : true})
    .populate("semester", "value -_id")
    .populate("category", "value -_id")
    .populate("badges", "value")
    .populate("tags", "name");

    //set tag.projects to new array without the projectId
    tag.projects = tag.projects.filter(id => id != projectId) 

    //Decrease the mentions
    if(tag.mentions > 0) {
        tag.mentions -= 1
    }
    await tag.save()


    return res.status(200).send(project)

}

//Should delete the tag from database
//Should iterate through each project (if any) removing the tag from project.tags
//And remove themselves

const deleteTag = async (req, res) => {
    const {tagName} = req.params

    const tag = await Tag.findOne({name: tagName})
    if(!tag){
        return res.status(404).send({tag:null, msg: 'no tag found'}) 
    }

    const tagProjects = tag.projects
    const deleteTagFromProject = []
    //need to pull the tagId from project.tags


    tagProjects.forEach(projectId => {
        deleteTagFromProject.push(Project.findByIdAndUpdate(projectId, {$pull: {tags: tag._id}}))
    })

    //Deletes the tag from all projects
    await Promise.all(deleteTagFromProject)

    //Deletes the tag
    await Tag.findByIdAndDelete(tag._id)

    return res.status(200).send(await Tag.find())
}

module.exports = {
    getAllTags,
    postNewTag,
    searchTag,
    addTagToProject,
    deleteTag,
    deleteTagFromProject,
    getTagByNameOrId,
    postNewTagAddToProject,
}