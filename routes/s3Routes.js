const express = require('express')
//Grabs auth and admin functions from the middleware (for Authorization)
const { auth } = require("../middleware/auth");
const {admin} = require("../middleware/admin");
const {graduate} = require("../middleware/graduate");

const multer = require('multer')
const {
    //User profile endpoints
    uploadUserProfilePicture,
    deleteUserProfilePic,

    //Gallery endpoints - requires a tab to exist
    uploadGallery,
    deleteGalleryS3,
    deleteGalleryImageS3,
    uploadImageToGallery,

    //Uploads image, gallery, video, poster acts as initial creation of a tab
    uploadTabPictures,
    
    //Upload max 5 phots of type image, video or poster
    uploadTabSingle,
    //Delete the photo from a tab
    deleteTabSingleFolderImage,

    //Delete all photos in the tab
    deleteAllFolders,

    //Banner for project
    bannerUpload,
    bannerDelete,
    //Thumbnail for project
    thumbnailUpload,
    thumbnailDelete,
    //Admin uploads of heroBanners for landing page
    uploadHeroBanners,
    deleteHeroBanner,
    getHeroBanners,
    //Adming uploads of new awards
    uploadAward,
    deleteAward,
    getAwards,
    //Mobile Banners
    uploadMobileHeroBanners,
    getMobileHeroBanners,
    deleteMobileHeroBanner,
    //Get the default banners and thumnails
    getDefaultBanners,
    getDefaultThumbnail,
} = require('../controllers/s3ControllerApi')




const router = express.Router()
const storage = multer.memoryStorage()

const uploadUserPicture = multer({storage, limits : 30485760})
const projectPictureRoute = multer({storage, limits : 30485760})

const projectFields = projectPictureRoute.fields([
    {name:"image", maxCount: 5}, 
    {name: "gallery", maxCount: 5},
    {name: "video", maxCount: 5},
    {name: "poster", maxCount: 5}]);


/*************************************
* USER PROFILE PICTURE POST REQUEST  *
*************************************/

//Delete user profile picture
router.delete('/userProfilePic/:id' , deleteUserProfilePic) //WORKS
//Upload user profile picture
router.post('/userProfilePic/:id' , uploadUserPicture.single('profilePicture'), uploadUserProfilePicture) //WORKS


router.get('/defaultBanners' , getDefaultBanners) //WORKS
router.get('/defaultThumbnails' , getDefaultThumbnail) //WORKS

//Uploads a new gallery to a tab name
router.get('/heroBanner' , getHeroBanners) //WORKS
router.post('/heroBanner' , projectPictureRoute.array('heroBanner', 5), uploadHeroBanners) //WORKS
router.delete('/heroBanner/:heroBannerName' , deleteHeroBanner) //WORKS

router.post('/award' , projectPictureRoute.single('award'), uploadAward) //WORKS
router.get('/award' , getAwards) //WORKS
router.delete('/award/:awardName' , deleteAward) //WORKS



router.post('/mobileHeroBanner' , projectPictureRoute.array('heroBanner', 5), uploadMobileHeroBanners) //WORKS
router.get('/mobileHeroBanner' , getMobileHeroBanners) //WORKS
router.delete('/mobileHeroBanner/:heroBannerName' , deleteMobileHeroBanner) //WORKS


/***************************************************
*               PROJECT CRUD REQUEST               *
****************************************************
* Creates a new tab in a project                   *
* accepts image, gallery, video or poster files    *
***************************************************/

//Upload all images. Should only be used when users create the project in client side
router.post('/project/:projectId/:tabName' , projectFields, uploadTabPictures)  //Works
//Delete all project pictures in a tab
router.delete('/project/:projectId/:tabName' , deleteAllFolders) //WORKS
//Delete either banner, video or poster image in a tab
router.delete('/project/:projectId/:tabName/:folder/:key' ,  deleteTabSingleFolderImage) //WORKS


/***********************
* GALLERY CRUD REQUEST *
***********************/

//Uploads a new gallery to a tab name
router.post('/gallery/:projectId/:tabName' , projectPictureRoute.array('gallery', 5), uploadGallery) //WORKS

//Deletes an entire gallery and removes any urls within this gallery that is in other galleries in the same tab
//And deletes the images from s3
router.delete('/allGallery/:projectId/:tabName/:galleryId' ,  deleteGalleryS3) //WORKS

//Adds images to a gallery and only accepts 4 uploads at a time. 
router.patch('/uploadGallery/:projectId/:tabName/:galleryId' , projectPictureRoute.array('gallery', 4), uploadImageToGallery) //WORKS 


//Deletes one image in gallery and removes the image from s3 and the url from other galleries
router.patch('/gallerySingleS3/:projectId/:tabName/:key', deleteGalleryImageS3) //WORKS



/******************************************
*     PROJECT TAB FOLDER POST REQUEST     *
*******************************************
* These endpointds add either an image,   *
* poster or video object to a tab and     *
* accept maximum of 5 uploads at a time   *
******************************************/

router.post('/image/:projectId/:tabName', projectPictureRoute.array('image', 5), uploadTabSingle) 
router.post('/poster/:projectId/:tabName', projectPictureRoute.array('poster', 5), uploadTabSingle)
router.post('/video/:projectId/:tabName', projectPictureRoute.array('video', 5), uploadTabSingle)


//Uploads a new gallery to a tab name
router.post('/banner/:projectId',  projectPictureRoute.single('banner'), bannerUpload) 
router.delete('/banner/:projectId',  bannerDelete) 

//Uploads a new gallery to a tab name
router.post('/thumbnail/:projectId',  projectPictureRoute.single('thumbnail'), thumbnailUpload) 
router.delete('/thumbnail/:projectId',  thumbnailDelete)



module.exports = router

