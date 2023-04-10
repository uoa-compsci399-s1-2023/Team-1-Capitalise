const mongoose = require('mongoose');
const { Project, validate } = require('../models/project');
const { User } = require('../models/user');
const { Comment, validateComment } = require('../models/comment');
const { Tag, validateTag } = require('../models/tag');
const { Parameter, validateParameter } = require('../models/parameter');

//Get all projects
const getAllProjects = async (req, res) => {
    //Populate the project members attribute with id and names of users.
    const projects = await Project.find().populate('members', '_id, name')
        .populate('semester', 'value -_id').populate('category', 'value -_id').populate('badges', 'value -_id').populate('tags', 'name -_id')
        .sort('name');
    res.send(projects);
}

//get all projects by likes
const getProjectsByLikes = async (req, res) => {
    const projects = await Project.find()
        .populate('semester', 'value -_id').populate('category', 'value -_id').populate('badges', 'value -_id').populate('tags', 'name -_id')
        .sort('likes');
    res.send(projects)
}


// get projects by badge
const getProjectByBadge = async (req, res) => {
    const myBadge = await Parameter.findOne({ value: req.params.badge, parameterType: "award" });
    if (!myBadge) return res.status(404).json({ err: "No badge found!" });
    //need to check badge
    const projects = await Project.find({ badges: { _id: myBadge._id } })

    if (projects.length == 0) {
        return res.status(200).json({ noBadgeGiven: `${myBadge.value} has not been given out` })
    }
    res.send(projects);

}


//find project by Id
const getProject = async (req, res) => {
    const { projectId } = req.params;

    //Checks if the paramter projectId is a valid Id i.e long enough
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(404).json({ err: "No projectid found" });
    }

    const project = await Project.findById(projectId).populate('semester', 'value -_id').populate('category', 'value -_id').populate('badges', 'value -_id').populate('tags', 'name -_id');

    //If no project exist
    if (!project) {
        return res.status(404).json({ err: "No project found" });
    }
    //If a project exist
    res.status(200).json(project);
}



const updateProjectById = async (req, res) => {
    const currentId = req.user._id;

    const { projectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(404).send({ err: "No project found" });
    }

    //Get members of this project
    const projectMembers = (await Project.findById(projectId)).members;

    //Check if user is part of the project
    const userIsMember = projectMembers.includes(currentId);


    if (!userIsMember) {
        return res.status(403).send({ err: "You are not part of this project" })
    }

    //Changes what ever is different
    //Doesnt add any additional tags
    const project = await Project.findOneAndUpdate({ _id: projectId }, { ...req.body });

    if (!project) {
        return res.status(404).json({ err: "No Project found" });
    }

    return res.status(200).json(project);
}

const addNewProject = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if semester exists in database
    const sem = await Parameter.findOne({ value: req.body.semester, parameterType: "semester" });
    if (!sem) return res.status(400).send("Error: Invalid semester!");
    //Check if category exists in database
    const cat = await Parameter.findOne({ value: req.body.category, parameterType: "category" });
    if (!cat) return res.status(400).send("Error: Invalid category!");

    let project = new Project({
        name: req.body.name,
        semester: { _id: sem._id },
        teamname: req.body.teamname,
        category: { _id: cat._id },
        repoLink: req.body.repoLink,
        members: [{
            _id: req.user._id
        }],
        content: req.body.content,
        likes: 0
    });

    //Check if award exists in database
    if (req.body.badges) {
        const badge = await Parameter.findOne({ value: req.body.badges, parameterType: "award" });
        if (!badge) return res.status(400).send("Error: Invalid award!");
        project.badges = { _id: badge._id };
    }

    //Create or fetch tag objects.
    if (req.body.tags) {
        for (const tagName of req.body.tags) {
            const tag = await Tag.findOne({ name: tagName });
            if (!tag) {
                let tag = new Tag({
                    name: tagName,
                    mentions: 1,
                    projects: [{
                        _id: project._id
                    }]
                });
                tag = await tag.save();
                console.log(tag.name + ' was created.');
                project.tags.push(tag._id);
            } else {
                const tag2 = await Tag.findByIdAndUpdate(tag._id, {
                    $inc: { mentions: 1 },
                    $push: { projects: project._id }
                });
                project.tags.push(tag2._id);
            }
        }
    }


    //Add project to the user

    const user = await User.findByIdAndUpdate(req.user._id, {
        project: {
            _id: project._id
        }
    });

    project = await project.save();

    res.send(project);
}

const writeComment = async (req, res) => {
    const { error } = validateComment(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let comment = new Comment({
        project: req.body.projectId,
        user: req.user._id,
        commentBody: req.body.commentBody
    });

    const user = await User.findByIdAndUpdate(req.user._id, {
        //Appends
        $push: { myComments: comment._id }
    });

    if (!user) {
        return res.status(404).json({ err: "No user found" });
    }

    const project = await Project.findByIdAndUpdate(req.body.projectId, {
        //Appends
        $push: { comments: comment._id }
    });

    if (!project) {
        return res.status(404).json({ err: "No project found" });
    }

    comment = await comment.save();

    res.send(comment);
}

const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById({ _id: commentId, })
    //different Id type from db id 
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(404).json({ err: "Wrong type of id " });
    }
    //If no comment is found
    if (!comment) {
        return res.status(404).json({ err: "No comment found!" });
    }

    //Check if user owns the comment they are deleting
    if (req.user._id != comment.user) return res.status(403).json({ err: "Not your comment!" });

    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: { myComments: comment._id }
    }
    );

    const project = await Project.findByIdAndUpdate(comment.project, {
        $pull: { comments: comment._id }
    }
    );

    const deleted = await Comment.findByIdAndDelete(commentId);

    res.send({ Success: `Comment ${commentId} deleted` });


}

//Endpoint is for adding team members only!
const addUserToProject = async (req, res) => {

    const myProj = await Project.findById(req.params.id);

    if (!myProj.members.includes(req.user._id)) {
        return res.status(403).send("You do not belong to the project you are appending another user to!");
    } else if (req.user._id == req.params.userid && myProj.members.includes(req.user._id)) {
        return res.status(400).send("Error - You already belong to the project!");
    } else if (myProj.members.includes(req.params.userid)) {
        return res.status(400).send("Error - This user already belongs to the project!");
    }

    //Adds the project to the User.
    const user = await User.findByIdAndUpdate(req.params.userid, {
        project: {
            _id: myProj._id
        }
    });

    if (!user) return res.status(400).send('Invalid user.');

    //Appends i.e. pushes the user onto the members.
    const project = await Project.findByIdAndUpdate(req.params.id,
        {
            //Appends
            $push: { members: req.params.userid }
        });

    if (!project) return res.status(404).send('The project with the given ID was not found.');

    res.send(project);
}


const deleteProject = async (req, res) => {
    const { projectId } = req.params

    const project = await Project.findById({ _id: projectId, })
    //differenet Id type from db id 
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(404).send({ err: "No project found" });
    }
    //If no project is found
    if (!project) {
        return res.status(404).send({ err: "No Project found" });
    }

    const members = await project.members
    members.forEach(async (id) => {
        //Need to properly check and test this method
        const user = await User.findByIdAndUpdate(id, { project: null })
    })
    const projectName = await project.name
    const deleted = await Project.findByIdAndDelete(projectId)

    res.send({ Success: `${projectName} deleted` })


}

const searchProjects = async (req, res) => {

    //Create a JSON object which stores a query.
    query = {};

    // If semester is specified as a parameter, add it to the query.
    if (req.params.semester != -1) {
        const mySem = await Parameter.findOne({ value: `${req.params.semester.substring(0, 2).toUpperCase()} ${req.params.semester.substring(2).toUpperCase()}`, parameterType: "semester" });
        if (!mySem) return res.status(404).send({ err: `Semester ${req.params.semester} found` });
        query.semester = {
            _id: mySem._id
        }
    }

    // If award is specified as a parameter, add it to the query.
    if (req.params.award != -1) {
        const myAward = await Parameter.findOne({ value: req.params.award, parameterType: "award" });
        if (!myAward) return res.status(404).send({ err: `Award ${req.params.award} found` });
        query.badges = {
            _id: myAward._id
        }
    }

    // If category is specified as a parameter, add it to the query.
    if (req.params.category != -1) {
        //let index = req.params.category.indexOf("+");
        //let myCat = `${req.params.category.substring(0,index)} ${req.params.category.substring(index+1)}`
        const myCategory = await Parameter.findOne({ value: {$regex: req.params.category, $options: 'i'}, parameterType: "category" });
        if (!myCategory) return res.status(404).send({ err: `Category ${req.params.category} found` });
        query.category = {
            _id: myCategory._id
        }
    }

    // If keyword is specified as a parameter, add it to the query. It may be in either the name or tag.
    if (req.params.keyword != -1) {
        const tag = await Tag.findOne({ name: req.params.keyword[0].toUpperCase() + req.params.keyword.substring(1).toLowerCase() });
        if (tag) {
            query.$or = [{ name: { $regex: req.params.keyword, $options: 'i' } }, { tags: { _id: tag._id } }];
        } else {
            query.name = { $regex: req.params.keyword, $options: 'i' };
        }
    }

    // Create a JSON object which stores the sort query. 
    sortQuery = {};
    if (req.query.sortBy) {
        const mySortRequest = req.query.sortBy.toLowerCase();
        (mySortRequest == 'likes') ? (sortQuery = { [mySortRequest]: -1 }) : (sortQuery = { [mySortRequest]: 1 }); //If sorting by likes, make it descending. 
    }


    //Find relevant projects.
    const projects = await Project.find(query).skip(req.query.startIndex).limit(req.query.numProjects)
        .populate('members', '_id, name')
        .populate('semester', 'value -_id').populate('category', 'value -_id').populate('badges', 'value -_id').populate('tags', 'name -_id')
        .sort(sortQuery);


    //Send the projects off.
    res.send(projects);

}


const likeComment = async (req, res) => {
    const currentId = req.user._id
    const { projectId } = req.params


    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(404).send({ err: "No project found" });
    }

    //check if project exist
    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).send({ err: "project not found" })
    }

    //Get members of this project
    const projectMembers = (await Project.findById(projectId)).members;

    //Check if user is part of the project
    const userIsMember = projectMembers.includes(currentId);

    //If user is part of the project
    if (userIsMember) {
        return res.status(403).send({ err: "You are not allowed to like your own project" })
    }
    const usersLikedProjects = (await User.findById(currentId)).likedProjects

    //Check if project Id is in the users likes attribute

    //If true
    //Decrement likes on project
    //Remove the liked project from users.LikedProjects
    if (usersLikedProjects.includes(projectId)) {

        const updateProject = await Project.findByIdAndUpdate(projectId, { $inc: { likes: -1 } })
        const likedProjects = usersLikedProjects.filter(project => {
            return project._id != projectId
        })
        await User.findByIdAndUpdate(currentId, { likedProjects: likedProjects })
        return res.status(200).send(updateProject)
    }

    //If false 
    //Add the project Id to user
    await User.findByIdAndUpdate(currentId, { $push: { likedProjects: projectId } })

    //Increment project.likes
    const likedProject = await Project.findByIdAndUpdate(projectId, { $inc: { likes: 1 } })

    return res.status(200).send(likedProject)

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
    searchProjects,
    writeComment,
    likeComment,
    deleteComment,
}