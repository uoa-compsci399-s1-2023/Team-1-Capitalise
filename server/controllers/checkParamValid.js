const { User} = require('../models/user');
const { Project } = require('../models/project');
const { Comment } = require('../models/comment');
const mongoose = require('mongoose')





const checkProject = async (projectId) => {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return false
    }
    //check if project exist
    const checkProject = await Project.findById(projectId);
    if (!checkProject) {
        return false

    }
    return true
}

const checkUser = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false
    }
    const user = await User.findById(id)
    if(!user){
        return false
    }
    return true
}

const checkComment = async (commentId) => {
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return false
    }
    const comment = await Comment.findById(commentId)
    if(!comment){
        return false
    }
    return true
}

module.exports = {
    checkProject,
    checkUser,
    checkComment,
}