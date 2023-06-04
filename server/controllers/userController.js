const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const { User, validate } = require("../models/user");
const { Project } = require("../models/project");
const { Comment, validateComment } = require("../models/comment");
const { checkUser } = require("./checkParamValid");
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NODEMAILEREMAIL,
    pass: process.env.NODEMAILERPASS,
  },
});

const sendConfirmationEmail = (name, email, confirmationCode) => {
  transport
    .sendMail({
      from: process.env.NODEMAILEREMAIL,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>You're almost there!</h1>
        <h2>Hey, ${name}!</h2>
        <p>Thank you for signing up to capitalise! There's just one more thing to do. Please confirm your email by clicking on the following link:</p>
        <a href=https://bh71phacjb.execute-api.ap-southeast-2.amazonaws.com/api/auth/confirm/${confirmationCode}>Click here to confirm</a>
        </div>`,
    })
    .catch((err) => console.log(err));
};

async function deleteComments(commentId) {
  try {
    const comment = await Comment.findById({ _id: commentId });

    const project = await Project.findByIdAndUpdate(comment.project, {
      $pull: { comments: commentId },
    });

    const deleted = await Comment.findByIdAndDelete(commentId);
  } catch (ex) {
    res.status(500).send(`Internal Server Error: ${ex}`);
  }
}

async function removeLikes(projectId) {
  try {
    await Project.findByIdAndUpdate(
      projectId,
      {
        $inc: { likes: -1 },
      },
      { new: true }
    );
  } catch (ex) {
    res.status(500).send(`Internal Server Error: ${ex}`);
  }
}

// Gets all users and sorts by name
const getAllUsers = async (req, res) => {
  // Added populate method to dynamically fetch information of project document!
  const users = await User.find({}, "-password -email -username")
    .populate("project", "_id, name")
    .sort("name");
  res.send(users);
};

//Get user by Id
const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ fail: `${id} is not a valid ID!` });

  const user = await User.findOne(
    { _id: id },
    "-password -email -username"
  ).populate("project", "_id, name");

  if (!user) {
    return res.status(400).json({ fail: `no user with id ${id} found!` });
  }

  res.send(user);
};

// Adds new user
const postUser = async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send({ fail: error.details[0].message });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ fail: `Email ${user.email} already exists!` });
    }

    if (req.body.username) {
      user = await User.findOne({ username: req.body.username });
      if (user) {
        return res.status(400).send("Username already registered.");
      }
    } else {
      req.body.username = req.body.email;
    }

    const gradEmailDomain = req.body.email.substring(
      req.body.email.indexOf("@") + 1
    );
    let myUserType = "";
    if (req.body.email === "asma.shakil@auckland.ac.nz") {
      myUserType = "admin";
    } else if (gradEmailDomain !== "aucklanduni.ac.nz") {
      myUserType = "visitor";
    } else {
      myUserType = "graduate";
    }

    const password = await bcrypt.hash(req.body.password, 10);

    if (!req.body.status) {
      req.body.status = "Pending";
    }

    let testEmails = [
      "testprojectuser@aucklanduni.ac.nz",
      "testprojectuser2@aucklanduni.ac.nz",
      "admin@capitalise.space",
      "thebro@capitalise.space",
      "testprojectvisitor@gmail.com",
      "projectuser@aucklanduni.ac.nz",
      "projectuser2@aucklanduni.ac.nz",
      "projectvisitor@gmail.com",
      "tagtestvisitor@gmail.com",
      "tagtestuser@aucklanduni.ac.nz"
      
    ];
    if (testEmails.includes(req.body.email.toLowerCase())) {
      req.body.status = "Active";
    } else {
      req.body.status = "Pending";
    }

    user = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: password,
      profilePicture: req.body.profilePicture,
      links: req.body.links,
      project: req.body.projectId ? { _id: req.body.projectId } : undefined,
      bio: req.body.bio,
      likedProjects: [],
      myComments: [],
      userType: myUserType,
      status: req.body.status,
      isGoogleCreated: false,
      displayEmail: req.body.displayEmail,
      skills: req.body.skills,
      confirmationCode: jwt.sign(
        { email: req.body.email },
        process.env.JWT_PRIVATE_KEY
      ),
    });

    if (req.body.projectId) {
      const project = await Project.findById(req.body.projectId);
      if (!project) {
        return res.status(400).json({ fail: `Invalid projectId provided!` });
      }
      project.members.push(user);
      await project.save();
    }

    user = await user.save();
    res.status(201).send(user);
    sendConfirmationEmail(user.name, user.email, user.confirmationCode);
  } catch (ex) {
    res.status(500).send(`Internal Server Error: ${ex}`);
  }
};

// Adds new user from Google
const postGoogleUser = async (profile) => {
  try {
    const gradEmailDomain = profile.email.substring(
      profile.email.indexOf("@") + 1
    );
    let myUserType = "";
    if (profile.email === "asma.shakil@auckland.ac.nz") {
      myUserType = "admin";
    } else if (gradEmailDomain !== "aucklanduni.ac.nz") {
      myUserType = "visitor";
    } else {
      myUserType = "graduate";
    }

    user = new User({
      name: profile.name,
      email: profile.email,
      username: profile.email,
      profilePicture: profile.picture.substring(0, profile.picture.length - 6),
      userType: myUserType,
      isGoogleCreated: true,
      status: "Active",
      confirmationCode: jwt.sign(
        { email: profile.email },
        process.env.JWT_PRIVATE_KEY
      ),
    });

    user = await user.save();
    // Save user and return
    return user;
  } catch (ex) {
    return `Internal Server Error: ${ex}`;
  }
};

const updateUserDetails = async (req, res) => {
  const { id } = req.params;

  if (id !== req.user._id && req.user.userType !== "admin") {
    return res
      .status(403)
      .json({ fail: "You are not authorized to edit this user" });
  }

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ fail: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ fail: "User not found" });
    }

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    if (req.user.userType !== "admin") {
      delete req.body.userType;
    }

    if (req.body.email) {
      req.body.username = req.body.email;
    }

    const updateUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    }).select("-password -email -username");
    res.json(updateUser);
  } catch (ex) {
    res.status(500).send(`Internal Server Error: ${ex}`);
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ fail: `User with id ${id} not found` });
    }

    if (id !== req.user._id && req.user.userType !== "admin") {
      return res
        .status(403)
        .json({ fail: "You are not authorized to delete this user" });
    }

    const { username, project } = user;

    if (project) {
      const myProj = await Project.findByIdAndUpdate(
        project,
        { $pull: { members: id } },
        { new: true }
      );
      if (myProj.members.length === 0) {
        await Project.findByIdAndDelete(myProj._id);
      }
    }

    if (user.myComments) {
      user.myComments.forEach((commentId) => deleteComments(commentId));
    }

    if (user.likedProjects) {
      user.likedProjects.forEach((projectId) => removeLikes(projectId));
    }

    await User.findByIdAndDelete(id);
    res.json({ removed: `${username} removed` });
  } catch (ex) {
    res.status(500).send(`Internal Server Error: ${ex}`);
  }
};

const adminDeleteUserById = async (req, res) => {
  const { id } = req.params;

  if (id === req.user._id) {
    return res
      .status(403)
      .send({ fail: "You are not allowed to delete yourself" });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).send({ noUser: `User with id ${id} not found` });
    }

    const { username, project } = user;

    if (project) {
      await Project.findByIdAndUpdate(project, { $pull: { members: id } });
    }

    if (user.myComments) {
      user.myComments.forEach((commentId) => deleteComments(commentId));
    }

    await User.findByIdAndDelete(id);

    res.status(200).send({ removed: `${username} removed` });
  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
};

const adminUpdateUserDetails = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send({ fail: "Wrong type of id" });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).send({ fail: "No user found" });
    }

    const { name, password, email, username, userType } = req.body;
    const encrypted = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(id, {
      name,
      password: encrypted,
      email,
      username,
      userType,
    });

    res.send(updatedUser);
  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -username -email"
    );
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
};

const searchUsers = async (req, res) => {
  const nameQuery = req.query.name || "";
  const isAvailable = req.query.isAvailable || "";
  req.query.userRole
    ? (userRole = "^" + req.query.userRole + "$")
    : (userRole = "");

  let searchQuery = {
    name: { $regex: nameQuery, $options: "i" },
    userType: { $regex: userRole, $options: "i" },
  };
  if (isAvailable === "true") {
    searchQuery.project = null;
  }

  try {
    const users = await User.find(searchQuery)
      .skip(req.query.startIndex)
      .limit(req.query.numUsers)
      .select("-password -username -email");
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
};

const getUserComments = async (req, res) => {
  const { id } = req.params;
  if (!(await checkUser(id))) {
    return res.status(400).send({ iser: null, msg: "No user found" });
  }

  try {
    const myComments = await Comment.find({ user: id }).populate(
      "user",
      "name email username profilePicture"
    );

    if (!myComments || myComments == []) {
      return res.status(400).send({ comments: null, msg: "No Comments made" });
    }
    return res.status(200).send(myComments);
  } catch (err) {
    res.status(500).send({ error: "Server error" });
  }
};

//Reset user password
const sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email }).populate(
    "project",
    "_id, name"
  );

  if (!user) {
    return res
      .status(400)
      .json({ fail: `No account is associated with this email address.` });
  }
  if (user.isGoogleCreated === true) {
    return res.status(400).json({ fail: `Please sign in using Google!` });
  }
  const passwordResetToken = jwt.sign(
    { email: user.email },
    process.env.JWT_PRIVATE_KEY,
    {
      expiresIn: "24h", // expires in 24 hours
    }
  );

  sendPasswordResetNodemailer(user.name, user.email, passwordResetToken);
  return res.status(200).json({
    success: `Success! We have sent a confirmation email to ${user.email}.`,
  });
};

const sendPasswordResetNodemailer = (name, email, passwordResetToken) => {
  //Send the mail
  transport
    .sendMail({
      from: process.env.NODEMAILEREMAIL,
      to: email,
      subject: "Capitalise.space - Reset your password",
      html: `<h2>Hey, ${name}!</h2>
      <p>Please reset your password by clicking on the following link:</p>
      <a href=https://www.capitalise.space/changePassword?passwordResetToken=${passwordResetToken}>Click here to reset your password</a>
      <p>Note that this confirmation link will expire in 24 hours.</p>
      </div>`,
    })
    .catch((err) => console.log(err));
};

const submitResetPass = async (req, res) => {
  res.send(`<html>
  <head>
    <title>Capitalise - Reset Password</title>
  </head>
  <body>
  <h1>So you forgot your password, ya goob.</h1>
  <p>Reset your password!</p>
    <form onsubmit="postData(event)" method="post">
      <input type="text" id="email" name="email" />
      <label for="email">Enter your email:</label>
      <input type="submit" value="Submit" />
    </form>
    <script>
      function postData(e) {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        const object = {};
        data.forEach((value, key) => (object[key] = value));

        console.log(object)

        //make the reset call
        fetch("https://bh71phacjb.execute-api.ap-southeast-2.amazonaws.com/api/users/sendResetPasswordEmail", {
          method: "POST",
          body: JSON.stringify(object),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => response.json())
          .then((json) => {
            if (json.success) {alert(json.success)} else {alert(json.fail)}});
      }
    </script>
  </body>
</html>`);
};

const resetPasswordForm = async (req, res) => {
  res.send(`<html>
  <head>
    <title>Capitalise - Reset Password</title>
  </head>
  <body>
    <h1>Reset your password!</h1>
    <p>I promise I will not steal your password and sell it on the darkweb.</p>
    <form onsubmit="postData(event)" method="post">
      <input type="text" id="password" name="password" />
      <label for="password">Enter your password:</label>
      <input type="submit" value="Submit" />
    </form>
    <script>
      function postData(e) {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        const object = {};
        data.forEach((value, key) => (object[key] = value));

        let params = new URLSearchParams(document.location.search);

        let passwordResetToken = params.get("passwordResetToken");

        object.passwordResetToken = passwordResetToken;

        //make the reset call
        fetch("https://bh71phacjb.execute-api.ap-southeast-2.amazonaws.com/api/users/resetPassword", {
          method: "POST",
          body: JSON.stringify(object),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => response.json())
          .then((json) => alert(json.success));

      }
    </script>
  </body>
</html>
`);
};

//Reset Password
const resetPassword = async (req, res) => {
  try {
    const decodedUser = jwt.verify(
      req.body.passwordResetToken,
      process.env.JWT_PRIVATE_KEY
    );
    try {
      let user = await User.findOne({
        email: decodedUser.email,
      });
      if (!user) {
        return res.status(400).send({ fail: "User Not found." });
      }
      const password = await bcrypt.hash(req.body.password, 10);
      await User.updateOne(
        { email: decodedUser.email },
        { password: password }
      );
      return res.status(200).send({
        success: "Your password was updated succesfully. Please sign in again.",
      });
    } catch (err) {
      return res.status(500).send({ fail: `Server failure: ${err}` });
    }
  } catch (err) {
    return res.status(403).send({
      fail: err,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  postUser,
  updateUserDetails,
  deleteUserById,
  getCurrentUser,
  adminDeleteUserById,
  adminUpdateUserDetails,
  postGoogleUser,
  searchUsers,
  getUserComments,
  sendResetPasswordEmail,
  resetPassword,
  resetPasswordForm,
  submitResetPass,
};
