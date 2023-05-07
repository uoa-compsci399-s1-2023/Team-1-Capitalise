const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

//Authorization for registered users.
function auth(req, res, next) {
  //Get the x-auth-token
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({fail: "Access denied. No token provided."});

  //Verify the JSON Web Token and store the payload body in an attribute called user.
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(400).json({ fail: `Invalid token provided!` });
  }
}

//Authorization for google users.
function googleAuth(req, res, next) {
  req.user ? next() : res.status(401).send("You are not authorized to access this endpoint!");
}

module.exports = { auth, googleAuth };
