const express = require("express");
const router = express.Router();

//Grabs auth and admin functions from the middleware (for Authorization)
const { auth } = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
  getCategories,
  getSemesters,
  getSortBys,
  getAwards,
  createParameter,
  deleteParameter,
} = require("../controllers/parameterController");

//Fetches all categories
router.get("/categories", getCategories);

//Fetches all semesters
router.get("/semesters", getSemesters);

//Fetches all sortBys (Probably redundant)
router.get("/sortBys", getSortBys);

//Fetches all awards
router.get("/awards", getAwards);

//Add new parameter.
router.post("/", [auth, admin], createParameter);

//Delete a parameter
router.delete("/:id", [auth, admin], deleteParameter);

module.exports = router;
