const mongoose = require("mongoose");
const { Project, validate } = require("../models/project");
const { User } = require("../models/user");
const { Comment, validateComment } = require("../models/comment");
const { Tag, validateTag } = require("../models/tag");
const { Parameter, validateParameter } = require("../models/parameter");
const { checkProject, checkUser, checkComment } = require("./checkParamValid");

//Get all projects
const getAllProjects = async (req, res) => {
  //Populate the project members attribute with id and names of users.
  const projects = await Project.find()
    .populate("members", "_id, name")
    .populate("semester", "value -_id")
    .populate("category", "value -_id")
    .populate("badges", "value")
    .populate("tags", "name")
    .collation({ locale: "en", strength: 2 })
    .sort({ name: 1 }); 
  return res.status(200).send(projects);
};

//get all projects by likes
const getProjectsByLikes = async (req, res) => {
  const projects = await Project.find()
    //.populate("members", "_id, name")
    .populate("semester", "value -_id")
    .populate("category", "value -_id")
    .populate("badges", "value")
    .populate("tags", "name")
    .sort("likes");

  return res.status(200).send(projects);
};

// get projects by badge
const getProjectByBadge = async (req, res) => {
  try {
    const myBadge = await Parameter.findOne({
      value: req.params.badge,
      parameterType: "award",
    });
    if (!myBadge) {
      return res.status(404).send({ project: null, msg: "No badge found!" });
    }
    //need to check badge
    const projects = await Project.find({ badges: { _id: myBadge._id } });

    if (projects.length == 0) {
      return res.status(404).send({
        projects: null,
        msg: `${myBadge.value} has not been given out`,
      });
    }
    return res.status(200).send(projects);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Internal Server Error: ${err}`);
  }
};

const sortSemesters = async () => {
  const semesters = await Parameter.find({ parameterType: "semester" });

  const semArray = semesters.map((semester) => semester.value.split(" "));

  semArray.sort((a, b) => {
    if (b[1] === a[1]) {
      return b[0] === "S2" ? 1 : -1;
    } else {
      return b[1] - a[1];
    }
  });

  const newSemArray = semArray.map((arr) => arr.join(" "));
  return newSemArray;
};

const getAwardedProjectByLatestSemester = async (req, res) => {
  try {
    const semesterList = await sortSemesters();
    let count = 0;

    let mySemester = await Parameter.findOne({
      value: semesterList[count++],
      parameterType: "semester",
    });

    if (!mySemester) {
      return res.status(400).send({ fail: "No semester found!" });
    }

    let projects = await Project.find({
      badges: { $ne: null },
      semester: mySemester._id,
    })
      .populate("semester", "value -_id")
      .populate("category", "value -_id")
      .populate("badges", "value")
      .populate("tags", "name");

    while (projects.length < 3) {
      if (count == semesterList.length) {
        return res.status(400).send({
          fail: "Error, no semesters have 3 projects or more with awards!",
        });
      }
      mySemester = await Parameter.findOne({
        value: semesterList[count++],
        parameterType: "semester",
      });
      if (!mySemester) {
        return res.status(400).send({ fail: "No semester found!" });
      }

      projects = await Project.find({
        badges: { $ne: null },
        semester: mySemester._id,
      })
        .populate("semester", "value -_id")
        .populate("category", "value -_id")
        .populate("badges", "value")
        .populate("tags", "name");
    }

    return res.status(200).send(projects);
  } catch (err) {
    res.status(500).send(`Internal Server Error: ${err}`);
  }
};

const getFrontPageHeadlines = async (req, res) => {
  try {
    let myGroup = await Project.aggregate([
      {
        $group: {
          _id: "$category",
          category: { $first: "$category" },
          totalLikes: { $sum: "$likes" },
        },
      },
      { $sort: { totalLikes: -1 } },
      { $limit: 5 },
    ]);

    myGroup2 = await Project.populate(myGroup, {
      path: "category",
      select: "value -_id",
    });

    return res.status(200).send(myGroup2);
  } catch (err) {
    res.status(500).send(`Internal Server Error: ${err}`);
  }
};

//find project by Id
const getProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    //Checks if projectId is valid and if projectExist
    if (!(await checkProject(projectId))) {
      return res.status(404).send({ project: null, msg: "No project found" });
    }

    const project = await Project.findById(projectId)
      //.populate("members", "_id, name")
      .populate("semester", "value -_id")
      .populate("category", "value -_id")
      .populate("badges", "value")
      .populate("tags", "name");

    //If a project exist
    return res.status(200).send(project);
  } catch (err) {
    res.status(500).send(`Internal Server Error: ${err}`);
  }
};

//Could be changed so that joi validates the body, which will cut the category and badge checks out
const updateProjectById = async (req, res) => {
  try {
    const currentId = req.user._id;

    //Checks if user id is valid and exist
    if (!(await checkUser(req.user._id))) {
      return res.status(404).send({ user: null, msg: "No user found" });
    }

    const { projectId } = req.params;
    //Check if projectId is valid and a project exist
    if (!(await checkProject(projectId))) {
      return res.status(404).send({ project: null, msg: "No project found" });
    }

    //Get members of this project
    let myProj = await Project.findById(projectId);
    const projectMembers = myProj.members;

    //Check if user is part of the project
    const userIsMember = projectMembers.includes(currentId);

    if (!userIsMember && req.user.userType !== "admin") {
      return res
        .status(403)
        .send({ project: null, msg: "You are not part of this project" });
    }

    if (req.body.semester) {
      //Check if semester exists in database
      const sem = await Parameter.findOne({
        value: req.body.semester,
        parameterType: "semester",
      });
      if (!sem)
        return res
          .status(400)
          .send({ project: null, msg: "Invalid semester!" });
      req.body.semester = sem._id;
    }

    if (req.body.category) {
      //Check if category exists in database
      const cat = await Parameter.findOne({
        value: req.body.category,
        parameterType: "category",
      });
      if (!cat)
        return res
          .status(400)
          .send({ project: null, msg: "Invalid category!" });
      req.body.category = cat._id;
    }

    if (req.body.badges) {
      //Check if user is an admin
      if (req.user.userType != "admin")
        return res.status(403).send({
          project: null,
          msg: "Only admins can update project badges!",
        });
      //Check if semester exists in database
      const award = await Parameter.findOne({
        value: req.body.badges,
        parameterType: "award",
      });
      if (!award)
        return res.status(400).send({ project: null, msg: "Invalid award!" });
      req.body.badges = award._id;
    }

    //Create or fetch tag objects.
    let myTagIdArr = [];
    if (req.body.tags) {
      for (const tagName of req.body.tags) {
        const tag = await Tag.findOne({
          name: { $regex: "^" + tagName + "$", $options: "i" },
        });
        if (!tag) {
          let tag = new Tag({
            name: tagName.charAt(0).toUpperCase() + tagName.slice(1),
            mentions: 1,
            projects: [
              {
                _id: myProj._id,
              },
            ],
          });
          tag = await tag.save();
          console.log(tag.name + " was created.");
          myTagIdArr.push(tag._id);
        } else {
          //Check if tag already belongs to the project
          if (!myProj.tags.includes(tag._id)) {
            const tag2 = await Tag.findByIdAndUpdate(tag._id, {
              $inc: { mentions: 1 },
              $push: { projects: myProj._id },
            });
            myTagIdArr.push(tag2._id);
          } else {
            myTagIdArr.push(tag._id);
          }
        }
      }

      //Get tag objects to delete
      let existingTagArr = [];
      let adjustedTags = [];
      for (const tagId of myProj.tags) {
        tag = await Tag.findById(tagId);
        existingTagArr.push(tag.name);
      }

      for (const tagName of req.body.tags) {
        adjustedTags.push(tagName.charAt(0).toUpperCase() + tagName.slice(1));
      }

      let difference = existingTagArr.filter((x) => !adjustedTags.includes(x));
      //console.log(existingTagArr, adjustedTags, difference);

      for (const tagName of difference) {
        const tag2 = await Tag.findOneAndUpdate(
          { name: tagName },
          {
            $inc: { mentions: -1 },
            $pull: { projects: myProj._id },
          },
          {new: true}
        );
        if (tag2.mentions === 0) {
          await Tag.findByIdAndDelete(tag2._id)
        }
      }

      req.body.tags = myTagIdArr;
    }

    const project = await Project.findOneAndUpdate(
      { _id: projectId },
      { ...req.body },
      { new: true }
    )
      //.populate("members", "_id, name")
      .populate("semester", "value -_id")
      .populate("category", "value -_id")
      .populate("badges", "value")
      .populate("tags", "name");

    return res.status(200).send(project);
  } catch (err) {
    res.status(500).send(`Internal Server Error: ${err}`);
  }
};

const addNewProject = async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ project: null, msg: error.details[0].message });
  try {
    //Check if user already has a project. NOT IMPLEMENTED YET FOR TESTING REASONS!
    // const myUser = await User.findById(req.user._id);
    // if (myUser.project) {
    //   return res
    //   .status(400)
    //   .send({ project: myUser.project, msg: "You already belong to a project!" });
    // }

    //Check if semester exists in database
    const sem = await Parameter.findOne({
      value: req.body.semester,
      parameterType: "semester",
    });
    if (!sem)
      return res.status(400).send({ project: null, msg: "Invalid semester!" });

    //No need to check if category exist as joi will take care of it
    const cat = await Parameter.findOne({
      value: req.body.category,
      parameterType: "category",
    });
    if (!cat)
      return res.status(400).send({ project: null, msg: "Invalid semester!" });

    let project = new Project({
      name: req.body.name,
      blurb: req.body.blurb,
      semester: { _id: sem._id },
      category: { _id: cat._id },
      links: req.body.links,
      teamname: req.body.teamname,
      likes: 0,
      views: 0,
      thumbnail: req.body.thumbnail,
      banner: req.body.banner,
      content: req.body.content,
      members: [
        {
          _id: req.user._id,
        },
      ],
    });

    //No need to check if category exist as joi will take care of it
    if (req.body.badges) {
      const badge = await Parameter.findOne({
        value: req.body.badges,
        parameterType: "award",
      });
      project.badges = { _id: badge._id };
    }

    //Create or fetch tag objects.
    if (req.body.tags) {
      for (const tagName of req.body.tags) {
        const tag = await Tag.findOne({
          name: { $regex: "^" + tagName + "$", $options: "i" },
        });
        if (!tag) {
          let tag = new Tag({
            name: tagName.charAt(0).toUpperCase() + tagName.slice(1),
            mentions: 1,
            projects: [
              {
                _id: project._id,
              },
            ],
          });
          tag = await tag.save();
          console.log(tag.name + " was created.");
          project.tags.push(tag._id);
        } else {
          const tag2 = await Tag.findByIdAndUpdate(tag._id, {
            $inc: { mentions: 1 },
            $push: { projects: project._id },
          });
          project.tags.push(tag2._id);
        }
      }
    }

    //Add project to the user

    const user = await User.findByIdAndUpdate(req.user._id, {
      project: {
        _id: project._id,
      },
    });

    project = await project.save();

    populated = await Project.findById(project._id)
      //.populate("members", "_id, name")
      .populate("semester", "value -_id")
      .populate("category", "value -_id")
      .populate("badges", "value")
      .populate("tags", "name");

    return res.send(populated);
  } catch (err) {
    res.status(500).send(`Internal Server Error: ${err}`);
  }
};

const writeComment = async (req, res) => {
  try {
    const { error } = validateComment(req.body);
    const projectId = req.body.projectId;

    if (!projectId) {
      return res.status(400).send({ project: null, msg: "No projectId given" });
    }

    if (error)
      return res
        .status(400)
        .send({ project: null, msg: error.details[0].message });

    if (!(await checkUser(req.user._id))) {
      return res.status(404).send({ user: null, msg: "No user found" });
    }

    if (!(await checkProject(projectId))) {
      return res.status(404).send({ project: null, msg: "No project found" });
    }

    let comment = new Comment({
      project: projectId,
      user: req.user._id,
      commentBody: req.body.commentBody,
      parentComment: req.body.parentComment,
    });

    const user = await User.findByIdAndUpdate(req.user._id, {
      //Appends
      $push: { myComments: comment._id },
    });

    const project = await Project.findByIdAndUpdate(projectId, {
      //Appends
      $push: { comments: comment._id },
    });

    comment = await comment.save();

    const justCreated = await Comment.findById(comment._id).populate(
      "user",
      "name email username profilePicture"
    );

    return res.status(200).send(justCreated);
  } catch (err) {
    res.status(500).send(`Internal Server Error: ${err}`);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    //different Id type from db id
    if (!(await checkComment(commentId))) {
      return res.status(404).send({ comment: null, msg: "No comment exist" });
    }

    const comment = await Comment.findById({ _id: commentId });

    //Check if user owns the comment they are deleting
    if (req.user._id != comment.user && req.user.userType != "admin")
      return res.status(403).send({ comment: null, msg: "Not your comment!" });

    const user = await User.findByIdAndUpdate(comment.user, {
      $pull: { myComments: comment._id },
    });

    const project = await Project.findByIdAndUpdate(comment.project, {
      $pull: { comments: comment._id },
    });

    const deleted = await Comment.findByIdAndDelete(commentId);

    return res.status(200).send({ user: user, project: project });
  } catch (err) {
    res.status(500).send(`Internal Server Error: ${err}`);
  }
};

//Endpoint is for adding team members only!
const addUserToProject = async (req, res) => {
  try {
    const { id, userid } = req.params;

    if (!(await checkUser(userid))) {
      return res.status(404).send({ user: null, msg: "No user found" });
    }

    if (!(await checkProject(id))) {
      return res.status(404).send({ project: null, msg: "No project found" });
    }

    const myProj = await Project.findById(id);

    //If the user does not belong to the project
    if (
      !myProj.members.includes(req.user._id) &&
      req.user.userType !== "admin"
    ) {
      return res.status(403).send({
        project: null,
        msg: "You do not belong to the project you are appending another user to!",
      });
      //If the user is already part of the project
    } else if (
      req.user._id == req.params.userid &&
      myProj.members.includes(req.user._id)
    ) {
      return res
        .status(400)
        .send({ project: null, msg: "You already belong to the project!" });
    }
    //If the person user is trying to add is already added
    else if (myProj.members.includes(userid)) {
      return res.status(400).send({
        project: null,
        msg: "This user already belongs to the project!",
      });
    }

    //Adds the project to the User.
    const user = await User.findByIdAndUpdate(req.params.userid, {
      project: {
        _id: myProj._id,
      },
    });

    //Appends i.e. pushes the user onto the members.
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        //Appends
        $push: { members: req.params.userid },
      },
      { new: true }
    )
      //.populate("members", "_id, name")
      .populate("semester", "value -_id")
      .populate("category", "value -_id")
      .populate("badges", "value")
      .populate("tags", "name");

    return res.status(200).send(project);
  } catch (err) {
    res.status(500).send(`Internal Server Error: ${err}`);
  }
};

const removeUserFromProject = async (req, res) => {
  try {
    const { id, projectId } = req.params;

    if (!(await checkUser(id))) {
      return res.status(400).send({ user: null, msg: "No user found" });
    }

    //If user tries to remove themself
    /*if (id == req.user._id) {
    return res
      .status(403)
      .json({ fail: "You are not authorized remove yourself" });
  }*/

    const user = await User.findById(req.user._id);

    //If a user is not an admin and their projectId is not null
    if (user.project != null && req.user.userType != "admin") {
      //Checks if user is part of the project they wish to remove a user from
      if (user.project._id != projectId) {
        return res
          .status(403)
          .json({ fail: "You are not authorized to edit this project" });
      }
    }
    //If a user has not project and they are not adamin
    else if (user.project == null && req.user.userType != "admin") {
      return res
        .status(403)
        .json({ fail: "You are not authorized to edit this project" });
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    //user must be an admin or their projectId is valid if above functions are not run

    //Check if user to be removed is in project
    let project = await Project.findById(projectId);

    //If we find the id in members attribute
    const memberIn = project.members.filter((member) => member._id == id);

    //If member is not found
    if (memberIn.length == 0) {
      return res
        .status(404)
        .send({ project: null, msg: "No member found with that id" });
    }

    //If user is found
    //Remove user from project
    project = await Project.findByIdAndUpdate(
      project._id,
      { $pull: { members: id } },
      { new: true }
    )
      .populate("members", "_id, name")
      .populate("semester", "value -_id")
      .populate("category", "value -_id")
      .populate("badges", "value -_id")
      .populate("tags", "_id, name");

    //Remove project from user
    await User.findByIdAndUpdate(id, {
      project: null,
    });
    //Send 200 status code and project
    return res.status(200).send(project);
  } catch (err) {
    res.status(500).send(`Internal Server Error: ${err}`);
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const currentId = req.user._id
    if (!(await checkProject(projectId))) {
      return res.status(404).send({ project: null, msg: "No project found" });
    }

    const project = await Project.findById({ _id: projectId });
    //differenet Id type from db id

    const projectMembers = project.members;
    //Check if user is not part of the project and user is not admin
    const userIsMember = projectMembers.includes(currentId);

    if (!userIsMember && req.user.userType !== "admin") {
      return res
        .status(403)
        .send({ project: null, msg: "You are not part of this project" });
    }
    
    projectMembers.forEach(async (id) => {
      //Need to properly check and test this method
      const user = await User.findByIdAndUpdate(id, { project: null });
    });
    await Project.findByIdAndDelete(projectId);

    const projects = await Project.find()
      .populate("members", "_id, name")
      .populate("semester", "value -_id")
      .populate("category", "value -_id")
      .populate("badges", "value")
      .populate("tags", "name")
      .sort("name");

    const commentsInProject = await Comment.find({ project: projectId });

    //Deletes comments in the Comments table and removes the comment from the user who commented
    if (commentsInProject.length > 0) {
      const deleteComments = [];
      const deleteCommentsInUser = [];
      commentsInProject.forEach((comment) => {
        deleteCommentsInUser.push(
          User.findByIdAndUpdate({ $pull: { myComments: comment._id } })
        );
        deleteComments.push(Comment.findByIdAndDelete(comment._id));
      });
      await Promise.all(deleteComments, deleteCommentsInUser);
    }

    return res.status(200).send(projects);
  } catch (err) {
    res.status(500).send(`Internal Server Error: ${err}`);
  }
};

const searchProjects = async (req, res) => {
  try {
    //Create a JSON object which stores a query.
    query = {};

    // If semester is specified as a parameter, add it to the query.
    if (req.query.semester) {
      let mySem = await Parameter.findOne({
        value: `${req.query.semester
          .substring(0, 2)
          .toUpperCase()} ${req.query.semester.substring(2).toUpperCase()}`,
        parameterType: "semester",
      });
      if (!mySem) {
        mySem = await Parameter.findOne({
          value:
            req.query.semester.substring(0, 2).toUpperCase() +
            req.query.semester.substring(2).toUpperCase(),
          parameterType: "semester",
        });
        if (!mySem)
          return res
            .status(404)
            .send({ project: null, msg: "Invalid semester!" });
      }
      query.semester = {
        _id: mySem._id,
      };
    }

    // If award is specified as a parameter, add it to the query.
    if (req.query.award) {
      const myAward = await Parameter.findOne({
        value: req.query.award,
        parameterType: "award",
      });
      if (!myAward)
        return res.status(404).send({ project: null, msg: "Invalid award!" });
      query.badges = {
        _id: myAward._id,
      };
    }

    // If category is specified as a parameter, add it to the query.
    if (req.query.category) {
      const myCategory = await Parameter.findOne({
        value: { $regex: req.query.category, $options: "i" },
        parameterType: "category",
      });
      if (!myCategory)
        return res
          .status(404)
          .send({ project: null, msg: "Invalid category!" });
      query.category = {
        _id: myCategory._id,
      };
    }

    // If keyword is specified as a parameter, add it to the query. It may be in either the name or tag.
    if (req.query.keyword) {
      const tag = await Tag.findOne({
        name: { $regex: "^" + req.query.keyword + "$", $options: "i" },
      });
      if (tag) {
        query.$or = [
          { name: { $regex: req.query.keyword, $options: "i" } },
          { tags: { _id: tag._id } },
        ];
      } else {
        query.name = { $regex: req.query.keyword, $options: "i" };
      }
    }

    // Create a JSON object which stores the sort query.
    sortQuery = {};
    if (req.query.sortBy) {
      if (
        [
          "semester",
          "category",
          "name",
          "badges",
          "likes",
          "createdat",
          "updatedat",
        ].includes(req.query.sortBy.toLowerCase())
      ) {
        const mySortRequest = req.query.sortBy.toLowerCase();
        mySortRequest == "likes"
          ? (sortQuery = { [mySortRequest]: -1 })
          : (sortQuery = { [mySortRequest]: 1 }); //If sorting by likes, make it descending.
        if (mySortRequest == "createdat") {
          sortQuery = { ["createdAt"]: -1 };
        } else if (mySortRequest == "updatedat") {
          sortQuery = { ["updatedAt"]: -1 };
        } else if (mySortRequest == "badges") {
          query.badges = {$ne: null};
          sortQuery = { badges: 1, name: 1};
        }
      } else {
        return res.status(400).send({ projects: null, msg: "invalid query" });
      }
    }

    //Find relevant projects.
    const populateFields = [
      { path: "semester", select: "value -_id" },
      { path: "category", select: "value -_id" },
      { path: "badges", select: "value" },
      { path: "tags", select: "name" },
    ];

    if (req.query.sortBy !== "semester") {
      const projects = await Project.find(query)
        .skip(req.query.startIndex)
        .limit(req.query.numProjects)
        .populate(populateFields)
        .sort(sortQuery);

      const totalProjectCount = await Project.find(query).count();

      projects.unshift(totalProjectCount);

      //Send the projects off.
      return res.status(200).send(projects);
    }

    if (req.query.sortBy === "semester") {
      let projects = await Project.find(query)
        .populate("semester", "value -_id")
        .populate("category", "value -_id")
        .populate("badges", "value")
        .populate("tags", "name");
      //Perform manual sorting - O(nlogn + n)ish
      projects.forEach((project) => {
        project.splitSem = project.semester.value.split(" ");
      });

      projects.sort((a, b) => {
        // Check for special case
        if (a.splitSem[0] === "SX" && a.splitSem[1] === "20XX") {
          return 1; // sort a after b
        } else if (b.splitSem[0] === "SX" && b.splitSem[1] === "20XX") {
          return -1; // sort b after a
        } else if (b.splitSem[1] === a.splitSem[1]) {
          return b.splitSem[0] === "S2" ? 1 : -1;
        } else {
          return b.splitSem[1] - a.splitSem[1];
        }
      });

      const slicedProjects = projects.slice(
        parseInt(req.query.startIndex),
        parseInt(req.query.startIndex) + parseInt(req.query.numProjects)
      );

      const totalProjectCount = await Project.find(query).count();

      slicedProjects.unshift(totalProjectCount);

      //Send the projects off.
      return res.status(200).send(slicedProjects);
    }
  } catch (err) {
    res.status(500).send(`Internal Server Error: ${err}`);
  }
};

const likeComment = async (req, res) => {
  try {
    const currentId = req.user._id;
    const { projectId } = req.params;

    if (!(await checkProject(projectId))) {
      return res.status(404).send({ project: null, msg: "No project found" });
    }

    //Get members of this project
    const projectMembers = (await Project.findById(projectId)).members;

    //Check if user is part of the project
    const userIsMember = projectMembers.includes(currentId);

    //If user is part of the project
    if (userIsMember) {
      return res.status(403).send({
        project: null,
        msg: "You are not allowed to like your own project",
      });
    }
    const usersLikedProjects = (await User.findById(currentId)).likedProjects;

    //Check if project Id is in the users likes attribute

    //If true
    //Decrement likes on project
    //Remove the liked project from users.LikedProjects
    if (usersLikedProjects.includes(projectId)) {
      const updateProject = await Project.findByIdAndUpdate(
        projectId,
        {
          $inc: { likes: -1 },
        },
        { new: true }
      )
        //.populate("members", "_id, name")
        .populate("semester", "value -_id")
        .populate("category", "value -_id")
        .populate("badges", "value")
        .populate("tags", "name");
      const likedProjects = usersLikedProjects.filter((project) => {
        return project._id != projectId;
      });
      const user = await User.findByIdAndUpdate(currentId, {
        likedProjects: likedProjects,
      });
      return res.status(200).send(updateProject);
    }

    //If false
    //Add the project Id to user
    await User.findByIdAndUpdate(
      currentId,
      {
        $push: { likedProjects: projectId },
      },
      { new: true }
    );

    //Increment project.likes
    const likedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        $inc: { likes: 1 },
      },
      { new: true }
    )
      //.populate("members", "_id, name")
      .populate("semester", "value -_id")
      .populate("category", "value -_id")
      .populate("badges", "value")
      .populate("tags", "name");

    return res.status(200).send(likedProject);
  } catch (err) {
    res.status(500).send(`Internal Server Error: ${err}`);
  }
};

const incrementViews = async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.projectId,
    {
      $inc: { views: 1 },
    },
    { new: true }
  )
    //.populate("members", "_id, name")
    .populate("semester", "value -_id")
    .populate("category", "value -_id")
    .populate("badges", "value")
    .populate("tags", "name");

  if (!project)
    return res.status(404).send({ project: null, msg: "No project found" });

  return res.status(200).send(project);
};

//Get all projects
const getAllComments = async (req, res) => {
  try {
    //Populate the project members attribute with id and names of users.
    const comments = await Comment.find().sort({ createdAt: -1 });
    return res.status(200).send(comments);
  } catch (err) {
    res.status(500).send(`Internal Server Error: ${err}`);
  }
};

const getCommentsByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;

    //Checks if the paramter projectId is a valid Id i.e long enough
    if (!(await checkProject(projectId))) {
      return res.status(404).send({ project: null, msg: "No project found" });
    }

    const project = await Project.findById(projectId).populate({
      path: "comments",
      populate: {
        path: "user",
        select: "name username profilePicture",
      },
    });

    return res.status(200).send(project.comments.reverse());
  } catch (err) {
    res.status(500).send(`Internal Server Error: ${err}`);
  }
};

const awardBadge = async (req, res) => {
  try {
    const projectId = req.body.projectId;

    if (!(await checkProject(projectId))) {
      return res.status(404).send({ project: null, msg: "No project found" });
    }

    //get Award
    const badge = await Parameter.findOne({
      value: req.body.award,
      parameterType: "award",
    });
    if (!badge)
      return res.status(400).send({ project: null, msg: "Invalid award!" });

    //Update the provided project
    const project = await Project.findByIdAndUpdate(
      projectId,
      {
        badges: badge._id,
      },
      { new: true }
    )
      //.populate("members", "_id, name")
      .populate("semester", "value -_id")
      .populate("category", "value -_id")
      .populate("badges", "value")
      .populate("tags", "name");

    return res.status(200).send(project);
  } catch (err) {
    res.status(500).send(`Internal Server Error: ${err}`);
  }
};

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
  incrementViews,
  getAllComments,
  getCommentsByProjectId,
  awardBadge,
  getAwardedProjectByLatestSemester,
  getFrontPageHeadlines,
  sortSemesters,
  removeUserFromProject,
};
