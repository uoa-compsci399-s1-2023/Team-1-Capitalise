const { S3Client,
    ListObjectsV2Command,
    DeleteObjectCommand,
    DeleteObjectsCommand,
    PutObjectCommand,
} = require("@aws-sdk/client-s3")
const dotenv = require('dotenv').config()
const { User, validate } = require('../models/user');
const { Project } = require('../models/project');
const { checkUser, checkProject } = require('./checkParamValid');

const client = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESSKEY,
        secretAccessKey: process.env.SECRETKEY
    }
})

const URL = process.env.URL


//Replaces spaces with + 
const checkString = (url) => {
    const modifiedString = url.replace(/\s+/g, '+');
    return modifiedString;
}

//Replaces spaces with + 
const revertString = (url) => {
    const modifiedString = url.replace(/\+/g, ' ');
    return modifiedString;
}

//Replaces spaces with + 
const checkFileType = (fileType) => {
    let modifiedString = ''
    if(fileType.includes('+')){
        modifiedString = fileType.split('+')
        return modifiedString[0]
    }
    return fileType
}


//To upload to s3 bucket
const s3Upload = async (params) => {
    const result = await client.send(params)
}

//Deletes all images related objects in mongoDb
const deleteAllTabImagesInMongoDb = async (projectId, tabName) => {
    const project = await Project.findById(projectId)
    const tabIndex = project.content.findIndex(tab => tab.tabName == tabName)
    if(tabIndex == -1){
        return null
    }
    const indexesToDelete = []
    const count = 0
    const folders = ['image', 'poster', 'video', 'gallery']
    
    const remainingFolders = project.content[tabIndex].tabContent.filter(imageObject => !folders.includes(imageObject.type))

    project.content[tabIndex].tabContent = remainingFolders

    if(project.content[tabIndex].tabContent.length == 0){
        project.content.splice(tabIndex, 1)

    }
    await project.save()
    return project

}



//Gets all the folders in the s3 bucket based on the projectId and the tabName
const getTabFolder = async (projectId, tabName) => {
    // return files
    const files = {
        "tabName": checkString(tabName),
        "image": [],
        "gallery": [],
        "video": [],
        "poster": []
    }

    const imageCommand = new ListObjectsV2Command({ Bucket: process.env.BUCKET, Prefix: `capitaliseProjects/${projectId}/${tabName}/image/` })
    const galleryCommand = new ListObjectsV2Command({ Bucket: process.env.BUCKET, Prefix: `capitaliseProjects/${projectId}/${tabName}/gallery/` })
    const videoCommand = new ListObjectsV2Command({ Bucket: process.env.BUCKET, Prefix: `capitaliseProjects/${projectId}/${tabName}/video/` })
    const posterCommand = new ListObjectsV2Command({ Bucket: process.env.BUCKET, Prefix: `capitaliseProjects/${projectId}/${tabName}/poster/` })

    const [imageContents, galleryContents, videoContents, posterContents] = await Promise.all([
        await client.send(imageCommand),
        await client.send(galleryCommand),
        await client.send(videoCommand),
        await client.send(posterCommand),
    ]);

    //Checks if there is any image returned
    if (imageContents.Contents) {
        imageContents.Contents.filter(data => data.Key != `capitaliseProjects/${projectId}/image/`).forEach(picture => {;
        const key = checkString(picture.Key)
        files.image.push(URL + key);})
    }
    else {
        files.image = []
    }

    if (galleryContents.Contents) {
        galleryContents.Contents.filter(data => data.Key != `capitaliseProjects/${projectId}/gallery/`).forEach(picture => {
            const key = checkString(picture.Key);
            files.gallery.push(URL + key)})}
    else {
        files.gallery = []
    }

    if (videoContents.Contents) {
        videoContents.Contents.filter(data => data.Key != `capitaliseProjects/${projectId}/video/`).forEach(video => {
        const key = checkString(video.Key)
        files.video.push(URL + key);})
    }
    else {
        files.video = [];
    }

    if (posterContents.Contents) {
        posterContents.Contents.filter(data => data.Key != `capitaliseProjects/${projectId}/poster/`).forEach(poster => {
        const key = checkString(poster.Key)
        files.poster.push(URL + key)
    })
    }
    else {
        files.poster = []
    }

    return files
}

//This is used for inital creation of a new tab. Not for singular uploads
const createTab = async (projectId, files) => {
    //Gets the projects contents    
    const project = (await Project.findById(projectId))
    const {tabName, image, gallery, video, poster} = files
    const newTab = {
        "tabName": revertString(tabName),
        "tabContent": []
        }
    
    if(image.length != 0){
    image.forEach(url=> {
        const imageObject = {
            "type": "image",
            "value": [url]
        }
        newTab.tabContent.push(imageObject)
    })}
    
    if(gallery.length != 0){
        newTab.tabContent.push({
            "type": "gallery",
            "value": gallery
        })
    }

    if(video.length != 0){
    video.forEach(url=> {
        const videoObject = {
            "type": "video",
            "value": [url]
        }
        newTab.tabContent.push(videoObject)
    })
    }

    if(poster != null || poster.length != 0){
    poster.forEach(url=> {
        const posterObject = {
            "type": "poster",
            "value": [url]
        }
        newTab.tabContent.push(posterObject)
    })
    }
    project.content.push(newTab)
    await project.save()
    return project
}


//Updates the corresponding folder (image, video, gallery or poster) in the mongoDb object's tabContent where tabName == tabName
const deleteSingleTabFolderImageMongo = async (projectId, tabName, folder, url) => {
    const project = await Project.findById(projectId)
    const projectContent = project.content
    const tabIndex = projectContent.findIndex(tab => tab.tabName == tabName)
    const existIndex = projectContent[tabIndex].tabContent.findIndex(imageObject => (imageObject.type == folder && imageObject.value[0] == url))

    if(existIndex == -1){
        return project
    }

    try{
        project.content[tabIndex].tabContent.splice(existIndex, 1)

        if(project.content[tabIndex].tabContent.length == 0){
            project.content.splice(tabIndex, 1)
        }

        await project.save()
        return project
    }
    catch(err){
        console.log(err)
        return null
    }    
}


//Updates a tab's tabContent based on the fieldname
//Expects there to be tabContent
const singleUpdateToMongo = async (projectId, tabName, folder, urlKey) => {
    const project = await Project.findById(projectId) //Gets project
    const projectContent = project.content

    //Find the index of the tab
    const tabIndex = projectContent.findIndex(tab => tab.tabName == tabName)
    
    //If tab not found
    if(tabIndex == -1){
        return null
    }

    //create a object for each key
    urlKey.forEach(key => {
        let keyExist = false
        const folderObject = {
            "type": folder,
            "value": [key]
        }

        //Checks if the key and type already exist
        project.content[tabIndex].tabContent.forEach(pictureObject => {
            //check if its a single valued object
            if(pictureObject.type == folder && (folder =='image' || folder == 'video' || folder == 'poster')){
                if((pictureObject.value[0] == key)){
                    keyExist = true
                }

            }
        })
    if(!keyExist){
        project.content[tabIndex].tabContent.push(folderObject)
    }
    keyExist = false

    })

    await project.save()
    return project
}

const uploadUserProfilePicture = async (req, res) => {
    const { id } = req.params
    const profilePic = req.file

    //Get the image type
    const imageType = checkFileType(profilePic.mimetype.split('/')[1])
    const params = {
        Bucket: process.env.BUCKET,
        Key: `userProfilePictures/${id}.${imageType}`,
        Body: profilePic.buffer,
        ContentType: profilePic.mimetype
    }

    const uploadCommand = new PutObjectCommand(params)
    //Get list of current profile pics which contains the id
    //Either empty array or array of length 1

    const command = new ListObjectsV2Command({
        Bucket: process.env.BUCKET,
        Prefix: `userProfilePictures/${id}`
    })
    const possibleProfilePic = (await client.send(command)).Contents
    //If user already has an image uploaded to s3 bucket
    //Deletes it
    if (possibleProfilePic) {
        //Delete the image
        const deleteObject = new DeleteObjectCommand({
            Bucket: process.env.BUCKET,
            Key: possibleProfilePic[0].Key,
        })
        await client.send(deleteObject)
    }
    try{
        //upload the image
        await s3Upload(uploadCommand)
        const profilePicURL = URL + params.Key
        await User.findByIdAndUpdate(id, { profilePicture: profilePicURL })
        const mongoDbUser = (await User.findById(id))
        //Returns picture URL
        return res.status(200).send(mongoDbUser)
    }
    catch(err){
        return res.status(404).send({user: null, msg: "Upload failed. Try reupload files"})
    }
}

//Method deletes a users profile picture if it exist
//And sets the database tag profilePicture to null
const deleteUserProfilePic = async (req, res) => {
    const { id } = req.params

    if (!(await checkUser(id))) {
        return res.status(404).send({user: null, msg:  "no user exist"})
    }

    const findUserProfilePicCommand = new ListObjectsV2Command({
        Bucket: process.env.BUCKET,
        Prefix: `userProfilePictures/${id}`
    })
    //Sends null or error message
    try {
        const findUserProfilePicture = (await client.send(findUserProfilePicCommand)).Contents
        if(findUserProfilePicture){
        const deleteCommand = new DeleteObjectCommand({
            Bucket: process.env.BUCKET,
            Key: findUserProfilePicture[0].Key
        })
        await client.send(deleteCommand)
    }



        await User.findByIdAndUpdate(id, { profilePicture: process.env.DEFAULTPROFILEPICTURE})
        //Returns null
        const mongoDbUser = await User.findById(id)
        return res.status(200).send(mongoDbUser)
    }
    catch (err) {
        return res.status(404).send({user: null, msg: err})
    }

}

//When a user wants to create a new tab
//Files fieldnames image, gallery, video and poster
const uploadTabPictures = async (req, res) => {
    const { projectId, tabName } = req.params;

    const files = req.files;
    const projectMembers = (await Project.findById(projectId)).members


    const fileOrg = ["image", "gallery", "video", "poster"];
    

    if (!(await checkProject(projectId))) {
        return res.status(404).send({ project: null, msg: 'no project exist' });
    }

    //Checks if any there is any files send
    if(files.image == null && files.poster == null && files.gallery == null && files.video == null ){
        return res.status(204)
    }

    //check if tabName already exist in project.
    const existParmas = {
        Bucket:process.env.BUCKET,
        Prefix: `capitaliseProjects/${projectId}/${tabName}/`
    }

    
    const listContents = new ListObjectsV2Command(existParmas)
    const existContents = (await client.send(listContents)).Contents
    //If there is already a tab with that name
    if(existContents){
        return res.status(404).send({ project: null, msg: 'tab already exist'});
    }


    const params = {
        Bucket: process.env.BUCKET,
        Key: "",
        Body: "",
        ContentType: ""
    };

    const promises = [];
    try {
        fileOrg.forEach((folder) => {
            const folderFiles = files[folder];
            if(folderFiles != null){
                folderFiles.forEach((image) => {
                    const fileType = checkFileType(image.mimetype.split('/')[1])
                    const fileOriginalName = image.originalname.split('.')[0]
                    const fileName = fileOriginalName + '.' + fileType
                    params.Key = `capitaliseProjects/${projectId}/${tabName}/${image.fieldname}/${fileName}`
                    params.Body = image.buffer
                    params.ContentType = image.mimetype
                    const uploadCommand = new PutObjectCommand(params)
                    promises.push(s3Upload(uploadCommand));
                });}
            
        });
    
    await Promise.all(promises);
    const s3TabFiles = await getTabFolder(projectId, tabName)
    const result = await createTab(projectId, s3TabFiles)
    return res.status(200).send(result)
    
} catch (err) {
    return res.status(404).send({project:null, msg : err });
}
}





//Deletes all images in a certain tab
//And updates the equivalent mongoDb project tab contents
const deleteAllFolders = async (req, res) => {
    const {projectId, tabName} = req.params
    
    if(!(await checkProject(projectId))){
        return res.status(404).send({ project: null, msg: 'no project exist' });
    }

    const listContentsCommand = new ListObjectsV2Command({
        Bucket: process.env.BUCKET,
        Prefix: `capitaliseProjects/${projectId}/${tabName}/`
    })

    const projectContents = (await client.send(listContentsCommand)).Contents

    //Check if project doesn't exist in s3
    if(projectContents){
        const deleteObjects = []
        //Iterate through all contents and delete
        projectContents.forEach(image => {
            deleteObjects.push({Key: image.Key})
        })    
    
        const deleteCommandParams = new DeleteObjectsCommand({
            Bucket: process.env.BUCKET,
            Delete: {Objects: deleteObjects}
        })
    
        await client.send(deleteCommandParams)
    }

    try{
        const result = await deleteAllTabImagesInMongoDb(projectId, tabName)
        return res.status(200).send(result) 
    }
    catch(err){
        console.log(err)
        return res.status(404).send({project : null, msg: err})
    }
}





//When a tab has been created, uploads a single image to s3 and mongoDb
//Only if its an image, banner, or poster
const uploadTabSingle = async(req, res) => {
    const {projectId, tabName} = req.params
    if (!(await checkProject(projectId))) {
        return res.status(404).send({ project: null, msg: 'no project exist' });
    }
    try{
    const files = req.files
    const promiseUploads = []
    const urlKey = []
    const fieldName = files[0].fieldname
    files.forEach(file => {
        //Get the image type
        const imageType = checkFileType(file.mimetype.split('/')[1])
        //Get image name
        const imageName = (file.originalname).split('.')[0]

        //Create parameters to add to bucket
        const uploadParams = {
            Bucket: process.env.BUCKET,
            //creates the path
            Key: `capitaliseProjects/${projectId}/${tabName}/${fieldName}/${imageName}.${imageType}`,
            Body: file.buffer,
            ContentType: file.mimetype
        }
            //upload the image to respective folder
            const uploadCommand = new PutObjectCommand(uploadParams)
            promiseUploads.push(s3Upload(uploadCommand))
            urlKey.push(URL + checkString(uploadParams.Key))
    })

    await Promise.all(promiseUploads)
    const result = await singleUpdateToMongo(projectId, tabName, fieldName, urlKey)
    if(result == null){
        return res.status(404).send({project: null, msg: 'no tab exist with that name'})
    }
    return res.status(200).send(result)
    }
    catch(err){
        return res.status(404).send({project: null, msg: "Upload failed. Try reuploading files"})
    }
    
    //End closing bracket
}





//Function that deletes a single image belonging in 
//either the poster, video or image folder
const deleteTabSingleFolderImage = async (req, res) => {
    const { projectId, tabName, folder, key } = req.params
    
    if (!(await checkProject(projectId))) {
        return res.status(404).send({project:null, msg: 'no project exist'});
    }

    const revertKey = revertString(key);
    
    const names = ["image", "video", "poster"]

    if(!names.includes(folder)){
        return res.status(404).send({project: null, msg: 'no folder exist'})
    }

    //List the contents in folder
    const findProjectFolderCommand = new ListObjectsV2Command({
        Bucket: process.env.BUCKET,
        Prefix: `capitaliseProjects/${projectId}/${tabName}/${folder}/`
    })

    const checkFolderExist = (await client.send(findProjectFolderCommand)).Contents
    if(!checkFolderExist){
        return res.status(404).send({project: null, msg: 'No folder exist'})
    }

    const images =  checkFolderExist.filter(imageObject => imageObject.Key.includes(revertKey))
    if(images.length == 0){
        return res.status(404).send({project: null, msg: 'no image exist'})
    }
    const image = images[0]

    const deleteImageParams= {
        Bucket: process.env.BUCKET,
        Key: image.Key
    }

    await client.send(new DeleteObjectCommand(deleteImageParams))
    const result = await deleteSingleTabFolderImageMongo(projectId, tabName, folder, URL+checkString(deleteImageParams.Key))
    if(result == null){
        return res.status(404).send({project:null, msg: "deleteSingleTabFolderImageMongo error"})
    }
    return res.status(200).send(result)
}




const uploadGallery = async (req, res) => {
    const { projectId, tabName} = req.params

    if (!(await checkProject(projectId))) {
        return res.status(404).send({project:null, msg: "Invalid ProjectId" })
    }
    const files = req.files
    const uploadPromise = []
    
    const urlKey = []
    files.forEach(file => {
        //gets file type
        const fileType = checkFileType(file.mimetype.split('/')[1])
        //Create the filename and check if it contains any spaces
        const originalName = file.originalname.split('.')[0]
        const fileName = originalName +"." + fileType
        const uploadParams = {
            Bucket: process.env.BUCKET,
            Key: `capitaliseProjects/${projectId}/${tabName}/gallery/${fileName}`,
            Body: file.buffer,
            ContentType: file.mimetype
        }
        uploadPromise.push(s3Upload(new PutObjectCommand((uploadParams))))
        urlKey.push(URL + checkString(uploadParams.Key))
    })
    await Promise.all(uploadPromise)

    const result = await addGalleryToMongoDb(projectId, tabName, urlKey)
    if(result == null){
        return res.status(404).send({project:null, msg: "addGalleryToMongo error"})
    }
    return res.status(200).send(result)
}

const addGalleryToMongoDb = async(projectId, tabName,  listOfUrls) => {
    const project = await Project.findById(projectId)
    const tabIndex = project.content.findIndex(tab => tab.tabName == tabName)

    if(tabIndex == -1){
        return project
    }

    const newGallery = {
        "type": "gallery",
        "value": listOfUrls
    }
    try{
    project.content[tabIndex].tabContent.push(newGallery)
    await project.save()
    return project
    }
    catch(err){
        console.log(err)
        return null
    }
}



//Uploads a single image to a gallery
//If the total number > 5 then returns error
//If <= 5 then Uploads to s3 and updates the mongoDb gallery based on galleryId
const uploadImageToGallery = async (req, res) => {
    const {projectId, tabName, galleryId} = req.params
    const files = req.files

    //find the gallery based galleryId
    const project = await Project.findById(projectId)
    const tabIndex = project.content.findIndex(tab => tab.tabName == tabName)
    //get tabContent
    const tabContent = project.content[tabIndex].tabContent

    const galleryIndex = tabContent.findIndex(index => index._id == galleryId)
    if(galleryIndex == -1){
        return res.status(204)
    }

    //need to check if a file with that original name already exist in the gallery
    const values = tabContent[galleryIndex].value

    const lengthOfValues = values.length

        //Check the length of value
    //If files.length + length of value > 5 dont let upload
    if(files.length + lengthOfValues > 5){
        return res.status(400).send({project:null, msg: `Please remove ${files.length + lengthOfValues - 5} files from the gallery or the files you want to upload`})
    }

    const sameFileName = []
    files.forEach(file => {
        const fileType = checkFileType(file.mimetype.split('/')[1])
        const fileName = checkString(file.originalname.split('.')[0] +'.'+ fileType)
        if(values.includes(URL + `capitaliseProjects/${projectId}/${tabName}/gallery/${fileName}`)){
            sameFileName.push(fileName)
        }
    })




    if(sameFileName.length != 0){
        return res.status(400).send(`Please remove these file(s) ${sameFileName} as the gallery already contains files with this name`)
    }

    const uploadPromise = []
    const urls = []
    files.forEach(file => {
        const fileType = checkFileType(file.mimetype.split('/')[1])
        const fileName = file.originalname.split('.')[0] +'.'+ fileType
        const fileParams = {
            Bucket: process.env.BUCKET,
            Key: `capitaliseProjects/${projectId}/${tabName}/gallery/${fileName}`,
            Body: file.buffer,
            ContentType: file.mimetype
        }
        //create the urls
        urls.push(URL + `capitaliseProjects/${projectId}/${tabName}/gallery/${checkString(fileName)}`)
        const uploadCommand = new PutObjectCommand(fileParams)
        //else upload to s3
        uploadPromise.push(s3Upload(uploadCommand))
})
    try{
    await Promise.all(uploadPromise)
    urls.forEach(url => {
        project.content[tabIndex].tabContent[galleryIndex].value.push(url)
    })

    await project.save()
    return res.status(200).send(project)
    }
    catch(err){
        return res.status(404).send({project:null, msg: err})
    }
}




//Method that deletes the galleryImage from s3 and updates each gallery containing this url
//Makes sure to revert the string to contain space
const deleteGalleryImageS3 = async(req, res) => {
    const {key, projectId, tabName} = req.params

    //Check project exist in mongoDb
    if(!(await checkProject(projectId))){
        return res.status(404).send({project:null, msg: "No project found"})
    }
    const project = await Project.findById(projectId);
    const tabIndex = project.content.findIndex(tab => tab.tabName == tabName)

    //Gets the tabContent of the tab
    const tabContent = project.content[tabIndex].tabContent
    
    const galleryIndexes = []
    //Grabs all gallery indexes
    tabContent.forEach(imageObject => {
        if(imageObject.type == 'gallery'){
            //add the indexes to the galleryIndex array
            galleryIndexes.push(tabContent.indexOf(imageObject))

        }
    })
    const keyUrl = `capitaliseProjects/${projectId}/${tabName}/gallery/${key}`
    /***************************************
     * Removes the url from every gallery  *
    ***************************************/

    //Interates through each gallery object to find if it contains the URL 
    galleryIndexes.forEach(index => {
        const currentGalleryObjectValues = tabContent[index].value
        //If this index contains the url in its gallery
        if(currentGalleryObjectValues.includes(URL +keyUrl)){
            //Grab its index
            const urlIndex = currentGalleryObjectValues.indexOf(URL + keyUrl)
            //Remove the url from the project.content[tabnameIndex].tabContent[indexOfGallery][urlLocation]
            project.content[tabIndex].tabContent[index].value.splice(urlIndex, 1)
        }

    })
    const reverseGalleryIndex = galleryIndexes.reverse();
    //Check each gallery to see if its empty.
    //If its empty then remove it
    reverseGalleryIndex.forEach(index => {
        if(project.content[tabIndex].tabContent[index].value.length == 0){
            project.content[tabIndex].tabContent.splice(index, 1)
        }
    })

    await project.save()

    //Checks and gives us a string with a space in it.
    const revertKey = revertString(key)
    const checkImageExist = {
        Bucket: process.env.BUCKET,
        Prefix: `capitaliseProjects/${projectId}/${tabName}/gallery/${revertKey}`
    }

    const s3ImageExist = (await client.send(new ListObjectsV2Command(checkImageExist))).Contents
    if(!s3ImageExist){
        return res.status(404).send({project:null, msg: "Image does not exist"})
    }

    const deleteImageParams = {
        Bucket: process.env.BUCKET,
        Key: `capitaliseProjects/${projectId}/${tabName}/gallery/${revertKey}`
    }

    await client.send(new DeleteObjectCommand(deleteImageParams))
    return res.status(200).send(project)

}


//Deletes the url from a gallery tabContent object
//Only used when a user want to get rid of an image, but wants to keep the image in other galleries
const deleteGalleryImage = async(req, res) => {
    const {projectId, tabName, galleryId, key} = req.params

    const project = await Project.findById(projectId)

    const tabIndex= project.content.findIndex(tab => tab.tabName == tabName)
    const tabContent = project.content[tabIndex].tabContent
    const galleryIndex = tabContent.findIndex(imageObject => imageObject._id == galleryId)
    if(galleryIndex == -1){
        return res.status(404).send({project:null, msg: "No gallery found"})
    }
    const galleryURL = URL +`capitaliseProjects/${projectId}/${tabName}/gallery/${key}`
    const gallery = tabContent[galleryIndex].value
    //If url is not in gallery
    if(!gallery.includes(galleryURL)){
        return res.status(404).send({project:null, msg:"image is not part of this gallery"})
    }

    const urlIndex = gallery.findIndex(urlLink => urlLink == galleryURL)
    
    project.content[tabIndex].tabContent[galleryIndex].value.splice(urlIndex, 1)

    if(project.content[tabIndex].tabContent[galleryIndex].value.length == 0){
        project.content[tabIndex].tabContent.splice(galleryIndex, 1)
    }
    await project.save()

    return res.status(200).send(project)

}

//Deletes a gallery from tabcontents, but does not delete the s3 equivlents
const deleteGallery = async (req, res) => {
    const {projectId, tabName, galleryId} = req.params
    
    if(!(await checkProject(projectId))){
        return res.status(404).send({project:null, msg: "projectId invalid"})
    }

    const project = await Project.findById(projectId)
    const tabIndex = project.content.findIndex(tab => tab.tabName == tabName)

    const galleryIndex = project.content[tabIndex].tabContent.findIndex(imageObject => imageObject._id == galleryId)
    if(galleryIndex == -1){
        return res.status(404).send({project:null, msg: "No gallery with that id found"})
    }

    project.content[tabIndex].tabContent.splice(galleryIndex, 1)

    await project.save()
    return res.status(200).send(project)

}


const deleteGalleryS3 = async (req, res) => {
    const { projectId, tabName, galleryId } = req.params
  
    try {
      // Check if project exists in mongoDB
      const project = await Project.findById(projectId)
      if (!project) {
        return res.status(404).send({ project: null, msg: "No project found" })
      }
  
      // Get the index of the tab in project.content
      const tabIndex = project.content.findIndex(tab => tab.tabName == tabName)
      if (tabIndex == -1) {
        return res.status(404).send({ project: null, msg: "No tab found" })
      }
  
      // Get the index of the gallery to be deleted in tabContent
      const tabContent = project.content[tabIndex].tabContent;

      const galleryIndex = tabContent.findIndex(imageObject => imageObject._id == galleryId)
      if (galleryIndex == -1) {
        return res.status(404).send({ project: null, msg: "No such gallery found" });
      }
  
      // Get the URLs to be deleted
      const deleteURLs = tabContent[galleryIndex].value
  
      // Delete objects from S3
      const deleteObjects = deleteURLs.map(url => {
        const splitURL = url.split("/")
        const imageName = splitURL[splitURL.length - 1]
        const keyName = `capitaliseProjects/${projectId}/${tabName}/gallery/${revertString(imageName)}`
        return { Key: keyName }
      })
  
      const deleteCommandParams = new DeleteObjectsCommand({
        Bucket: process.env.BUCKET,
        Delete: { Objects: deleteObjects },
      })
  
      await client.send(deleteCommandParams)
  
      // Remove the deleted URLs from other galleries
      project.content[tabIndex].tabContent.forEach(imageObject => {
        if (imageObject.type == "gallery" && imageObject._id !== galleryId && imageObject.value.some(url => deleteURLs.includes(url))) {
          // The imageObject is a gallery and contains one or more URLs that were deleted
          const updatedValue = imageObject.value.filter(url => !deleteURLs.includes(url))
          // If the updated gallery is empty, remove it from the tabContent
          if (updatedValue.length == 0) {
            //Return tabContent where the current imageObject is not included
            project.content[tabIndex].tabContent = project.content[tabIndex].tabContent.filter(
              otherImageObject => otherImageObject._id !== imageObject._id
            )
          } 
          else {
            //Update the imageObject urls
            imageObject.value = updatedValue
          }
        }
      })
    
        //Removes the gallery from mongoDB 
        project.content[tabIndex].tabContent.splice(galleryIndex, 1)
      

      // If the tabContent is now empty, remove the tab from projectContent
      if (project.content[tabIndex].tabContent.length == 0) {
        project.content.splice(tabIndex, 1)
      }
  
      await project.save();
  
      return res.status(200).send(project)
    } 
    catch (err) {
      return res.status(404).send({project:null, msg:err})
    }
}


const bannerUpload = async (req, res) => {
    const { projectId } = req.params
    const bannerPic = req.file

    if (!(await checkProject(projectId))) {
        return res.status(404).send({user: null, msg:  "no project exist"})
    }
    

    if(req.file == null){
        return res.status(204)
    }
    
    //Get the image type
    const imageType = checkFileType(bannerPic.mimetype.split('/')[1])
    const params = {
        Bucket: process.env.BUCKET,
        Key: `capitaliseProjects/${projectId}/banner.${imageType}`,
        Body: bannerPic.buffer,
        ContentType: bannerPic.mimetype
    }

    const uploadCommand = new PutObjectCommand(params)
    //Get list of current profile pics which contains the id
    //Either empty array or array of length 1

    const command = new ListObjectsV2Command({
        Bucket: process.env.BUCKET,
        Prefix: `capitaliseProjects/${projectId}/banner`
    })
    const possibleProfilePic = (await client.send(command)).Contents
    //If user already has an image uploaded to s3 bucket
    //Deletes it
    if (possibleProfilePic) {
        //Delete the image
        const deleteObject = new DeleteObjectCommand({
            Bucket: process.env.BUCKET,
            Key: possibleProfilePic[0].Key,
        })
        await client.send(deleteObject)
    }
    try{
        //upload the image
        await s3Upload(uploadCommand)
        const bannerURL = URL + params.Key
        await Project.findByIdAndUpdate(projectId, { banner:  bannerURL})
        const project = (await Project.findById(projectId))
        //Returns picture URL
        return res.status(200).send(project)
    }
    catch(err){
        return res.status(404).send({project: null, msg: "Upload failed. Try reupload files"})
    }

}

const bannerDelete = async (req, res) => {
    const {projectId} = req.params
   if (!(await checkProject(projectId))) {
        return res.status(404).send({project:null, msg: 'no project exist'});
    }

    const checkBannerLength = {
        Bucket: process.env.BUCKET,
        Prefix: `capitaliseAssets/banners`
    }
    const bannerLength = (await client.send(new ListObjectsV2Command(checkBannerLength))).Contents.length

    //check to see if a banner already exist
    const checkBannerParams = {
        Bucket: process.env.BUCKET,
        Prefix: `capitaliseProjects/${projectId}/banner`
    }

    const bannerExist = (await client.send(new ListObjectsV2Command(checkBannerParams))).Contents
    if(!bannerExist){
        return res.status(404).send({project: null, msg: 'no banner found'})
    }

    imageKey = bannerExist[0].Key
    const deleteBannerParams = {
        Bucket: process.env.BUCKET,
        Key: imageKey
    }
    try{
        const bannerNumber = Math.floor(Math.random() * (bannerLength))
        await client.send(new DeleteObjectCommand(deleteBannerParams))
        await Project.findByIdAndUpdate(projectId, {banner: `https://capitalise-projects30934-staging.s3.ap-southeast-2.amazonaws.com/capitaliseAssets/banners/banner${bannerNumber}.png`})
        const project = await Project.findById(projectId)
        return res.status(200).send(project)
    }
    catch(err){
        return res.status(404).send({project: null, msg:"error deleting the project banner"})
    }

}


const thumbnailUpload = async (req, res) => {
    const {projectId} = req.params
    const thumbnail = req.file
    if (!(await checkProject(projectId))) {
        return res.status(404).send({project:null, msg: 'no project exist'});
    }

    if(req.file == null){
        return res.status(204)
    }

    const imageType = checkFileType(thumbnail.mimetype.split('/')[1])
    const params = {
        Bucket: process.env.BUCKET,
        Key: `capitaliseProjects/${projectId}/thumbnail.${imageType}`,
        Body: thumbnail.buffer,
        ContentType: thumbnail.mimetype
    }

    const uploadCommand = new PutObjectCommand(params)

    //check to see if a banner already exist
    const checkThumbnailParams = new ListObjectsV2Command({
        Bucket: process.env.BUCKET,
        Prefix: `capitaliseProjects/${projectId}/thumbnail`
    })
    const thumbnailExist = (await client.send(checkThumbnailParams)).Contents

    if(thumbnailExist){
        imageKey = thumbnailExist[0].Key
        const deleteThumbnailCommand = new DeleteObjectCommand({
            Bucket: process.env.BUCKET,
            Key: imageKey

        })
        await client.send(deleteThumbnailCommand)
    }

    try{
        await s3Upload(uploadCommand)
        const url = URL + params.Key
        await Project.findByIdAndUpdate(projectId, {thumbnail: url})
        const project = await Project.findById(projectId)
        return res.status(200).send(project)
    }
    catch(err){
        return res.status(400).send({project: null, msg:'error uploading the project thumbnail'})
    }

}

const thumbnailDelete = async (req, res) => {
    const {projectId} = req.params

   if (!(await checkProject(projectId))) {
        return res.status(404).send({project:null, msg: 'no project exist'});
    }


    //check to see if a banner already exist
    const checkThumbnailParams = {
        Bucket: process.env.BUCKET,
        Prefix: `capitaliseProjects/${projectId}/thumbnail`
    }

    const thumbnailExist = (await client.send(new ListObjectsV2Command(checkThumbnailParams))).Contents
    if(!thumbnailExist){
        return res.status(404).send({project: null, msg: 'no thumbnail found'})
    }

    imageKey = thumbnailExist[0].Key
    const deleteThumbnailParams = {
        Bucket: process.env.BUCKET,
        Key: imageKey
    }
    try{
        await Project.findByIdAndUpdate(projectId, {thumbnail: process.env.DEFAULTTHUMBNAIL})
        await client.send(new DeleteObjectCommand(deleteThumbnailParams))
        const project = await Project.findById(projectId)
        return res.status(200).send(project)
    }
    catch(err){
        return res.status(404).send({project: null, msg:"error deleting the project thumbnail"})
    }


}

const uploadHeroBanners = async (req, res) => {
    const files = req.files
    const uploadPromise = []
    const urls = []
    files.forEach(file => {
        const fileType = checkFileType(file.mimetype.split('/')[1])
        const fileName = file.originalname.split('.')[0] +'.'+ fileType
        const fileParams = {
            Bucket: process.env.BUCKET,
            Key: `capitaliseAssets/heroBanners/${fileName}`,
            Body: file.buffer,
            ContentType: file.mimetype
        }
        //create the urls
        urls.push(URL + `capitaliseAssets/heroBanners/${checkString(fileName)}`)
        // upload to s3
        const uploadCommand = new PutObjectCommand(fileParams)
        uploadPromise.push(s3Upload(uploadCommand))
        })
    try{
        await Promise.all(uploadPromise)
        const keyPrefix = `capitaliseAssets/heroBanners/`
        const updatedUrls =[]
        const getHeroBanners = {
            Bucket: process.env.BUCKET,
            Prefix: keyPrefix
        }
    
        const fileExist = (await client.send(new ListObjectsV2Command(getHeroBanners))).Contents
        //Iterate through the contents of fileExist skipping the first index where it is just the folder
        for(let i = 0; i < fileExist.length; i++){
            if(fileExist[i].Size > 0){
            updatedUrls.push(URL + checkString(fileExist[i].Key))
        }}

        return res.status(200).send(updatedUrls)
    }
    catch(err){
        return res.status(404).send({heroBanners :null, msg: err})
    }
}

const deleteHeroBanner = async (req, res) => {
    const {heroBannerName} = req.params
    var fileKey = ''
    const keyPrefix = `capitaliseAssets/heroBanners/`
    const updatedUrls = []

    //check to see if a banner already exist
    const checkHeroBannerParams = {
        Bucket: process.env.BUCKET,
        Prefix: keyPrefix
    }

    const fileExist = (await client.send(new ListObjectsV2Command(checkHeroBannerParams))).Contents
    if(!fileExist){
        return res.status(404).send({heroBanners: null, msg: 'no heroBanners found'})
    }
    //Iterate through the contents of fileExist skipping the first index where it is just the folder
    for(let i = 0; i < fileExist.length; i++){
        if(fileExist[i].Size > 0){
            if(fileExist[i].Key == keyPrefix + revertString(heroBannerName)){
                fileKey = fileExist[i].Key
            }
            else{
                updatedUrls.push(URL + checkString(fileExist[i].Key))
            }
        }

    }

    try{
        const deleteHeroBannerParams = {
            Bucket: process.env.BUCKET,
            Key: keyPrefix + revertString(heroBannerName)
        }
        await client.send(new DeleteObjectCommand(deleteHeroBannerParams))

        return res.status(200).send(updatedUrls)
    }
    catch(err){
        return res.status(404).send({heroBanners: null, msg:"error deleting the heroBanner"})
    }
}

const getHeroBanners = async (req, res) => {
    const keyPrefix = `capitaliseAssets/heroBanners/`
    const updatedUrls =[]

    const getHeroBanners = {
        Bucket: process.env.BUCKET,
        Prefix: keyPrefix
    }

    const fileExist = (await client.send(new ListObjectsV2Command(getHeroBanners))).Contents
    //Iterate through the contents of fileExist skipping the first index where it is just the folder
    if(fileExist){

    for(let i = 0; i < fileExist.length; i++){
        if(fileExist[i].Size > 0){
           updatedUrls.push(URL + checkString(fileExist[i].Key)) 
        }
        
    }}


    return res.status(200).send(updatedUrls)
}



const uploadAward = async (req, res) => {
    const files = req.files
    const uploadPromise = []
    const urls = []
    files.forEach(file => {
        const fileType = checkFileType(file.mimetype.split('/')[1])
        const fileName = file.originalname.split('.')[0] +'.'+ fileType
        const fileParams = {
            Bucket: process.env.BUCKET,
            Key: `capitaliseAssets/awards/${fileName}`,
            Body: file.buffer,
            ContentType: file.mimetype
        }
        //create the urls
        urls.push(URL + `capitaliseAssets/awards/${checkString(fileName)}`)
        // upload to s3
        const uploadCommand = new PutObjectCommand(fileParams)
        uploadPromise.push(s3Upload(uploadCommand))
        })
    try{
        await Promise.all(uploadPromise)
        const keyPrefix = `capitaliseAssets/awards/`
        const updatedUrls =[]
        const getAwards = {
            Bucket: process.env.BUCKET,
            Prefix: keyPrefix
        }
    
        const fileExist = (await client.send(new ListObjectsV2Command(getAwards))).Contents
        //Iterate through the contents of fileExist skipping the first index where it is just the folder
        if(fileExist){
            for(let i = 0; i < fileExist.length; i++){
                if(fileExist[i].Size > 0){
                updatedUrls.push(URL + checkString(fileExist[i].Key))
                }}
        }
        return res.status(200).send(updatedUrls)
    }
    catch(err){
        return res.status(404).send({awards :null, msg: err})
    }
}

const getAwards = async (req, res) => {
    const keyPrefix = `capitaliseAssets/awards/`
    const updatedUrls =[]

    const getAwards = {
        Bucket: process.env.BUCKET,
        Prefix: keyPrefix
    }

    const fileExist = (await client.send(new ListObjectsV2Command(getAwards))).Contents
    //Iterate through the contents of fileExist skipping the first index where it is just the folder
    if(fileExist){
        for(let i = 0; i < fileExist.length; i++){
            if(fileExist[i].Size > 0){
               updatedUrls.push(URL + checkString(fileExist[i].Key)) 
            }
            
        }}
    return res.status(200).send(updatedUrls)
}

const deleteAward= async (req, res) => {
    const {awardName} = req.params
    var fileKey = ''
    const keyPrefix = `capitaliseAssets/awards/`
    const updatedUrls = []

    //check to see if a banner already exist
    const checkAwardParams = {
        Bucket: process.env.BUCKET,
        Prefix: keyPrefix
    }

    const fileExist = (await client.send(new ListObjectsV2Command(checkAwardParams))).Contents
    if(!fileExist){
        return res.status(404).send({award: null, msg: 'no awards found'})
    }
    //Iterate through the contents of fileExist skipping the first index where it is just the folder
    for(let i = 0; i < fileExist.length; i++){

        if(fileExist[i].Key == keyPrefix + revertString(awardName) && fileExist[i].Size > 0){
            fileKey = fileExist[i].Key
        }
        else{
            updatedUrls.push(URL + checkString(fileExist[i].Key))
        }
    }

    try{
        const deleteAwardParams = {
            Bucket: process.env.BUCKET,
            Key: keyPrefix + revertString(awardName)
        }
        await client.send(new DeleteObjectCommand(deleteAwardParams))

        return res.status(200).send(updatedUrls)
    }
    catch(err){
        return res.status(404).send({award: null, msg:"error deleting the award"})
    }
}


module.exports = {
    uploadUserProfilePicture,
    uploadGallery,
    deleteUserProfilePic,
    deleteGallery,
    deleteGalleryS3,
    deleteGalleryImageS3,
    deleteGalleryImage,
    uploadImageToGallery,
    uploadTabPictures,
    uploadTabSingle,
    deleteTabSingleFolderImage,
    deleteAllFolders,
    bannerUpload,
    bannerDelete,
    thumbnailUpload,
    thumbnailDelete,
    uploadHeroBanners,
    deleteHeroBanner,
    getHeroBanners,
    uploadAward,
    deleteAward,
    getAwards,
}