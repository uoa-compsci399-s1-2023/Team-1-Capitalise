const mongoose = require('mongoose');
const { Project, validate } = require('../models/project');
const { User } = require('../models/user');

//Get all projects
const getAllProjects = async (req, res) => {
    //Populate the project members attribute with id and names of users.
    const projects = await Project.find().populate('members', '_id, name').sort('name');
    res.send(projects);
}

//get all projects by likes
const getProjectsByLikes = async (req, res) => {
    const projects = await Project.find().populate('members', '_id, name').sort('likes');
    res.send(projects)
}


// get projects by badge
const getProjectByBadge = async (req, res) => {
    const { badge } = req.params;
    //need to check badge
    res.status(200).json({ badge: `${badge}` });
}


//find project by Id
const getProject = async (req, res) => {
    const { projectId } = req.params;

    //Checks if the paramter projectId is a valid Id i.e long enough
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(404).json({ err: "No projectid found" });
    }

    const project = await Project.findById(projectId);

    //If no project exist
    if (!project) {
        return res.status(404).json({ err: "No project found" });
    }
    //If a project exist
    res.status(200).json(project);
}



const updateProjectById = async (req, res) => {
    const { projectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(404).json({ err: "No project found" });
    }

    //Changes what ever is different
    //Doesnt add any additional tags
    const project = await Project.findOneAndUpdate({ _id: projectId }, { ...req.body });

    if (!project) {
        return res.status(404).json({ err: "No Project found" });
    }
    res.status(200).json(project);
}


const addNewProject = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send('Invalid user.');

    let project = new Project({
        name: req.body.name,
        semester: req.body.semester,
        repoLink: req.body.repoLink,
        members: [{
            _id: user._id
        }],
        content: req.body.content,
        likes: 0,
        badges: req.body.badges,
        tags: req.body.tags
    });


    //Add project to user's project attribute. 
    user.project = {
        _id: project._id
    };

    project = await project.save();
    updateUser = await user.save();

    res.send(project);
}


const addUserToProject = async (req, res) => {

    const myProj = await Project.findById(req.params.id);


    //Adds the project to the User.
    const user = await User.findByIdAndUpdate(req.params.userid, {
        project: {
            _id: myProj._id,
            projectName: myProj.name
        }
    });

    if (!user) return res.status(400).send('Invalid user.');

    //Appends i.e. pushes the user onto the members.
    const project = await Project.findByIdAndUpdate(req.params.id,
        {
            //Appends
            $push: { members: user }
        }, { new: true });

    if (!project) return res.status(404).send('The project with the given ID was not found.');


    res.send(project);
}


const deleteProject = async (req, res) => {
    const { projectId } = req.params

    const project = Project.findById({ _id: projectId })

    //differenet Id type from db id 
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(404).json({ err: "Wrong type of id " });
    }
    //If no project is found
    if (!project) {
        return res.status(404).json({ err: "No Project found" });
    }

    /*****Find the user where projectId : projectId*****/
    const users = await User.find()

    /*****Then delete the project it self*****/


    res.status(200).json({ user: users, del: 'del' });
}


module.exports = {
    getAllProjects,
    getProjectsByLikes,
    getProjectByBadge,
    getProject,
    updateProjectById,
    addNewProject,
    addUserToProject,
    deleteProject,
}