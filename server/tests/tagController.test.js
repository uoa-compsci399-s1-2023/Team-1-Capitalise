const request = require('supertest')
const app = require('../app')

const cors = require('dotenv').config()
const URLstring = '/api/tags/'
const { Tag } = require('../models/tag')
const { User, validate } = require("../models/user");
const { Project } = require("../models/project");


/*  Before all  */
const visitorData = {
    name: "tag test visitor",
    email: "tagTestVisitor@gmail.com",
    password: "test",
    links: [
      {
        type: "github",
        value: "https://www.github.com/testProjectVistor",
      },
    ],
    skills: ["speling"],
    status: 'Active'
  }
  
  const noTagFound = 'no tag found'
  const tagExist = 'Tag already exists'
  const noProject = 'no project found'
  var userId = ''
  var visitorId = ''
  var projectId = ''
  var tagId = ''
  var newTag = ''
  var tagToProject = ''

  //Create a test user
  const data = {
    name: "tag test user",
    email: "tagTestUser@aucklanduni.ac.nz",
    password: "test",
    links: [
      {
        type: "github",
        value: "https://www.github.com/testProjectUser",
      },
    ],
    skills: ["speling"],
    status: 'Active'
  }
  

  const projectData = {
    "name": "testTagProject", 
    "semester": "S1 2023",
    "category": "Mobile Development",
    "tags": ["superCool", "javascript"]
  }    
  
  var userSignIn = {
    "username": data.email, 
    "password": data.password
  }
  
  var visitorSignIn = {
    "username": visitorData.email,
    "password": visitorData.password
  }

  const adminSignin = {
    "username":process.env.USERADMIN,
    "password":process.env.USERADMINPASSWORD
  }
  
  const getToken = async (signIn) => {
    const token = await request(app)
    .post('/api/auth')
    .send(
      signIn
    )
    return token.text
  }
  
  beforeAll(async () => {
    [visitorId, userId] = await Promise.all([
      request(app).post("/api/users").send(visitorData),
      request(app).post("/api/users").send(data),
    ]).then((responses) => responses.map((res) => res.body._id));

  });
  
  
  
  afterAll(async () => {
    await Promise.all([
      User.findByIdAndDelete(visitorId),
      User.findByIdAndDelete(userId),
      Project.findByIdAndDelete(projectId),
      Tag.findOneAndDelete(tagToProject._id)
    ])
  });

describe('Test the getAllTags endpoint', () => {
    it('Expects 200 and all tags', async () => {
        const response = await request(app)
        .get(URLstring)
        expect(response.statusCode).toEqual(200)
    })
})


describe('Test the /:tagName using postNewTag' , () => {
  it('Expects status 200 and new tag', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .post(URLstring + 'newTag')
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(200)
    expect(response.body.name).toEqual('newTag')
    tagId = response.body._id
    newTag = response.body.name
  })

  it('Expects status 404 when a tagName already exist ', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .post(URLstring + 'newTag')
    .set('x-auth-token', xToken)
    
    expect(response.statusCode).toEqual(400)
  })
})

describe('Test the postNewTagAddToProject endpoint', () => {
  //Post a new tag and add it to the project
  it('Expects statuscode 200 and a new tag to be made and the project to have the new tag in its tags', async () => {
    const xToken = await getToken(userSignIn)

    const project = await request(app).post("/api/projects")
    .send(projectData)
    .set('x-auth-token', xToken)

    projectId = project.body._id

    const response = await request(app)
    .post(URLstring + `addThisToProject/${projectId}`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(200)
    expect(response.body._id).toEqual(projectId)

    tagToProject = await Tag.findOne({name: 'addThisToProject'})
  })

  it('Expects 400 and msg ~ Tag already exists', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .post(URLstring + `newTag/${projectId}`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual(tagExist)
  })

  it('Expects 404 and msg ~ No project found', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .post(URLstring + `NoProjectId/${tagId}`)
    .set('x-auth-token', xToken)
    
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })

})

//Patch a project with the new tag

describe('Test the PATCH /:tagName/:projectId using addTagToProject', () => {
  it('Expects 200 and the tag, with projectId in its projects and project to contain the tag', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .patch(URLstring + `newTag/${projectId}`)
    .set('x-auth-token', xToken)

    const tagInProject = {_id : response.body.tag._id, name: response.body.tag.name}

    expect(response.statusCode).toEqual(200)
    expect(response.body.tag.projects.includes(projectId))
    
    expect(response.body.project.tags.includes(tagInProject))
  })

  it('Expects 404 with msg no project found', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .patch(URLstring + `newTag/projectId`)
    .set('x-auth-token', xToken)
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })

  it('Expects 404 with msg no tag found', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .patch(URLstring + `verycoolTag/${projectId}`)
    .set('x-auth-token', xToken)
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noTagFound)
  })

  it('Expects 400 with msg  tag already contains this project', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .patch(URLstring + `newTag/${projectId}`)
    .set('x-auth-token', xToken)
    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual('tag already contains this project')
  })

  it('Expects 403 with when a user not part of project tries to append to it', async () => {
    const xToken = await getToken(visitorSignIn)
    const response = await request(app)
    .patch(URLstring + `newTag/${projectId}`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(403)
  })


})


describe('Test the getTagByNameOrId endpoint', () => {
    it('Expects 200 and when given a tagName that exist', async () => {
        const response = await request(app)
        .get(URLstring + 'newTag')
        expect(response.statusCode).toEqual(200)
    })

    it('Expects 200 and when given a tag id that exist', async () => {
        const response = await request(app)
        .get(URLstring + tagId)
        expect(response.statusCode).toEqual(200)
    })

    it('Expects 404 and when given a tagName that doesnt exist ', async () => {
        const response = await request(app)
        .get(URLstring + 'ThisTagDoesntExist')
        expect(response.statusCode).toEqual(404)
    })

    it('Expects 404 and when given a tag id that doesnt exist', async () => {
        const response = await request(app)
        .get(URLstring + '646ac07025419de4ff40ef51')
        expect(response.statusCode).toEqual(404)
    })
})


describe('Test the GET /search route using searchTag', () => {
  it('Expects statusCode 200 and list of tags', async() => {
    const response = await request(app)
    .get(URLstring + 'search')
    .query({name: newTag})

    expect(response.statusCode).toEqual(200)
    expect(response.body.length > 0)
  })
})

//Delete the tag from user's project
describe('Test the DELETE /:tagName/:projectId using the deleteTagFromProject', () => {
  it('Expects 200 with the project project.tags to not contain the tag', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .delete(URLstring + `${newTag}/${projectId}`)
    .set('x-auth-token', xToken)

    const projectTags = response.body.tags
    const tag = await Tag.findOne({name: newTag})
    expect(response.statusCode).toEqual(200)
    expect(!projectTags.includes({_id: tag._id, name: tag.name}))

  })

  it('Expects 404 when tag does not exist', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .delete(URLstring + `TagDoesNotExist/${projectId}`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual('no tag found')

  })

  it('Expects 404 when projectId is not valid', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .delete(URLstring + `${newTag}/projectId`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)

  })
})



describe('Test the DELETE /:tagName using deleteTag', () => {

  it('Expects 200 and tag is deleted', async () => {
    const xToken = await getToken(adminSignin)
    let tag = await Tag.findOne({name: newTag})    
    const tagInProject = {_id: tag._id, name:tag.name}
    const response = await request(app)
    .delete(URLstring + newTag)
    .set('x-auth-token', xToken)

    const project = await Project.findById(projectId)

    expect(response.statusCode).toEqual(200)    
    tag = await Tag.findOne({name: newTag})
    expect(tag).toEqual(null)
  })

  it('Expects 404 and msg no tag found', async () => {
    const xToken = await getToken(adminSignin)
    const response = await request(app)
    .delete(URLstring + newTag)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noTagFound)
    
  })
})