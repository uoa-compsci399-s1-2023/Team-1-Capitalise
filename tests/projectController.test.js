const request = require('supertest')
const app = require('../app')

const { Project, validate} = require("../models/project");
const mongoose = require("mongoose");

const invalidProjectId = "No project found with that projectId."
const invalidToken = 'Invalid token.'
const noToken = 'Access denied. No token provided.'
const notGraduate = 'Access Denied. You do not have the relevant permissions to access this resource!'
const invalidBadge = "Invalid award!"

const visitorData = {
  name: "project test visitor",
  email: "testProjectVisitor@gmail.com",
  password: "test",
}

var testUser = ''
var testVisitor = ''
var userSignIn = {
  "username": "testProjectUser@aucklanduni.ac.nz", 
  "password": "test"
}

var visitorSignIn = {
  "username": "testProjectVisitor@gmail.com", 
  "password": "test"
}



//Create a test user
const data = {
  name: "project test user",
  email: "testProjectUser@aucklanduni.ac.nz",
  password: "test",
  links: [
    {
      type: "github",
      value: "https://www.github.com/testProjectUser",
    },
  ],
  skills: ["speling"],
}


const createUser = async () =>{
  testUser = await request(app)
    .post("/api/users")
    .send(data)
}

const getToken = async (signIn) => {
  const token = await request(app)
  .post('/api/auth')
  .send(
    signIn
  )
  return token.text
}


const createVisitor = async () => {
  testVisitor = await request(app)
  .post("/api/users")
  .send(visitorData)
}

createUser()
createVisitor();

/////////////////////////////////////////////////////////////////////////////////////////////



describe("Test that fetches projects", () => {

  /********************************** 
  *           TEST / ROUTE          *
  **********************************/ 
  it("Sends a 200 response if all projects are fetched", async () => {
    const response = await request(app)
      .get("/api/projects/")
      .expect(200)

    expect(response.body.projects.length).toBeGreaterThan(1);
  });


  /********************************** 
  *     TEST /:projectId ROUTE      *
  **********************************/

  it('Sends status code 200 if a project\'s id matches parameter projectId' ,async() => {
    const response = await request(app)
    .get('/api/projects/6432f9226cce2fc1706572e3')
    .expect(200)

    expect(response.body.project._id == "6432f9226cce2fc1706572e3") 
  })

  it('Sends status code 404 if parameter projectId is an invalid mongoDb id' ,async() => {
    const response = await request(app)
    .get('/api/projects/invalidId')
    .expect(404)

    expect(response.body.project == null && response.body.msg == invalidProjectId)

  })

  it('Sends status code 404 if no project exist that matches parameter projectId' ,async() => {
    const response = await request(app)
    //Changed 3 to 9 at end of string
    .get('/api/projects/6432f9226cce2fc1706572e9')
    .expect(404)

    expect(response.body.project == null && response.body.msg == invalidProjectId)
  })
});



describe('POST Project from endpoint /api/projects/', () => {

  it('Post a project successfully and expects statusCode 200 ', async () => {
    const xToken = await getToken(userSignIn)
    //Create test project
    const testProject = {
      "name": "testProjectForwardSlash", 
      "semester": "S1 2023",
      "category": "Mobile Development"
    }    
    
    const response = await request(app)
    .post('/api/projects/')
    .set('x-auth-token', xToken)
    .send(testProject)

    expect(response.statusCode).toEqual(200)
    expect(response.body.project.name).toEqual(testProject.name)
  })


  it('Expects statusCode 401 When x-auth-token is not set',  async() => {
    const testProject = {
      "name": "testProject", 
      "semester": "S1 2023",
      "category": "Web Development"
    }    
    const response = await request(app)
    .post('/api/projects/')
    .send(testProject)
    .expect(401)

    expect(response.text).toEqual(noToken)
    
  })

  it('Expects statusCode 400 When token is invalid ',  async() => {
    const testProject = {
      "name": "testProject", 
      "semester": "S1 2023",
      "category": "Web Development"
    }    
    const response = await request(app)
    .post('/api/projects/')
    .set('x-auth-token', 'xToken')
    .send(testProject)
    
    expect(response.statusCode).toEqual(400)
    expect(response.text).toEqual(invalidToken)
  
  })


  it('Expects statusCode 403 when user is not graduate ',  async() => {
    const xToken = await (getToken(visitorSignIn))
    const testProject = {
      "name": "testProject", 
      "semester": "S1 2023",
      "category": "Web Development"
    }    
    
    const response = await request(app)
    .post('/api/projects/')
    .set('x-auth-token', xToken)
    .send(testProject)
    
    expect(response.statusCode).toEqual(403)
    expect(response.text).toEqual(notGraduate)
  })

 
  it('Expects statusCode 400 when body of a required attribute is not added',  async() => {
    const xToken = await getToken(userSignIn)
    const testProject = {
    }    
    const response = await request(app)
    .post('/api/projects/')
    .set('x-auth-token', xToken)
    .send(testProject)
    expect(response.statusCode).toEqual(400)
  })

  it('Expects statusCode 400 when category attribute data is incorrect',  async() => {
    const xToken = await getToken(userSignIn)
    const testProject = {
      "name": "testProject", 
      "semester": "S1 2023",
      "category": "Some Category"
    }    
    const response = await request(app)
    .post('/api/projects/')
    .set('x-auth-token', xToken)
    .send(testProject)

    expect(response.statusCode).toEqual(400)
  })


  it('Expects statusCode 400 for a semester that does not exist',  async() => {
    const xToken = await getToken(userSignIn)
    const testProject = {
      "name": "testProject", 
      "semester": "S1 1000",
      "category": "Web Development"
    }    
    const response = await request(app)
    .post('/api/projects/')
    .set('x-auth-token', xToken)
    .send(testProject)

    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual("Invalid semester!")

  })

  it('Expects statusCode 400 semester length is incorrect',  async() => {
    const xToken = await getToken(userSignIn)
    const testProject = {
      "name": "testProject", 
      "semester": "S1 100",
      "category": "Web Development"
    }    
    const response = await request(app)
    .post('/api/projects/')
    .set('x-auth-token', xToken)
    .send(testProject)
    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual("\"semester\" length must be at least 7 characters long")
  })

  it('Expects statusCode 400 category is not valid ',  async() => {
    const xToken = await getToken(userSignIn)
    const testProject = {
      "name": "testProject", 
      "semester": "S1 2023",
      "category": "Wrong Category"
    }    
    const response = await request(app)
    .post('/api/projects/')
    .set('x-auth-token', xToken)
    .send(testProject)

    expect(response.statusCode).toEqual(400)
  })

  it('Expects statusCode 400 badge is not valid ',  async() => {
    const xToken = await getToken(userSignIn)
    const testProject = {
      "name": "testProject", 
      "semester": "S1 2023",
      "category": "Web Development",
      "badges" : {
        "value" : "Wrong Badge"
      }
    }    
    const response = await request(app)
    .post('/api/projects/')
    .set('x-auth-token', xToken)
    .send(testProject)

    expect(response.statusCode).toEqual(400)
  })
  
  //Last brackets
})



/*
describe('Test the endpoint to see if a projects views is incremented', () => {

})*/
