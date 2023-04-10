const express = require('express');
const router = express.Router();

const {
    getCategories,
    getSemesters,
    getSortBys,
    getAwards,
} = require('../controllers/parameterController')

//Fetches all categories
router.get('/categories', getCategories);

//Fetches all semesters
router.get('/semesters', getSemesters);

//Fetches all sortBys (Probably redundant)
router.get('/sortBys', getSortBys);

//Fetches all awards
router.get('/awards', getAwards);




module.exports = router;