const express = require("express");
const router = express.Router();

const {
    getAllAbouts,
    getAboutById,
    addAbout,
    editAbout,
    deleteAbout,
  } = require("../controllers/aboutController");
  

//Grabs auth and admin functions from the middleware (for Authorization)
const { auth } = require("../middleware/auth");
const admin = require("../middleware/admin");

//Fetches all abouts
router.get("/", getAllAbouts);

//Fetches about by id
router.get("/:id", getAboutById);

//POSTs an about
router.post("/", [auth, admin], addAbout);

//PATCHES an about
router.patch("/:id", [auth, admin], editAbout);

//DELETES an about
router.delete("/:id", [auth, admin], deleteAbout)

module.exports = router;