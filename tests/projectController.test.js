const request = require('supertest')
const app = require('../app')

const { Project,} = require("../models/project");
const { User } = require('../models/user');
const { Comment } = require('../models/comment');
const admin = require('../middleware/admin');
const cors = require('dotenv').config()

const URLstring = '/api/projects/'


const noProject = 'No project found'
const invalidToken = 'Invalid token provided!'
const noToken = 'Access denied. No token provided.'
const notGraduate = 'Access Denied. You do not have the relevant permissions to access this resource!'
const notYourComment = "Not your comment!"
const invalidSemester = 'Invalid semester!'
const invalidCategory = 'Invalid category!'
const noUser = 'No user found'
const invalidAward = 'Invalid award!'
const notAdmin = 'Access Denied.'


const visitorData = {
  name: "project test visitor",
  email: "testProjectVisitor@gmail.com",
  password: "test",
  links: [
    {
      type: "github",
      value: "https://www.github.com/testProjectVistor",
    },
  ],
  skills: ["speling"],
}


var testUser = ''
var testUser2= ''
var testVisitor = ''

var visitorSignIn = {
  "username": "testProjectVisitor@gmail.com", 
  "password": "test"
}

var userId = ''
var userId2 = ''
var visitorId = ''
var projectId = ''
var commentId = ''
var commentUser = ''
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

const data2 = {
  name: "project test user2",
  email: "testProjectUser2@aucklanduni.ac.nz",
  password: "test",
  links: [
    {
      type: "github",
      value: "https://www.github.com/testProjectUser2",
    },
  ],
  skills: ["spelling"],
}

const projectData = {
  "name": "testProjectForwardSlash", 
  "semester": "S1 2023",
  "category": "Mobile Development",
  "tags": ["superCool"]
}    

var userSignIn = {
  "username": data.email, 
  "password": data.password
}

var userSignIn2 = {
  "username": data2.email,
  "password": data2.password
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
  [visitorId, userId, userId2] = await Promise.all([
    request(app).post("/api/users").send(visitorData),
    request(app).post("/api/users").send(data),
    request(app).post("/api/users").send(data2)
  ]).then((responses) => responses.map((res) => res.body._id));


});


afterAll(async () => {
  await Promise.all([
    User.findByIdAndDelete(visitorId),
    User.findByIdAndDelete(userId),
    User.findByIdAndDelete(userId2)
  ])
});
/////////////////////////////////////////////////////////////////////////////////////////////



describe("Test that fetches projects GET", () => {
  /********************************** 
  *           TEST / ROUTE          *
  **********************************/ 
  it("Sends a 200 response if all projects are fetched using getAllProjects", async () => {


    const response = await request(app)
      .get(URLstring)

    expect(response.statusCode).toEqual(200)
    expect(response.body.length > 0);
  });



  /********************************** 
  *     TEST /:projectId ROUTE      *
  **********************************/

  it('Sends status code 200 if a project\'s id matches parameter projectId using getProject' ,async() => {
    const response = await request(app)
    .get(URLstring + '6432f9226cce2fc1706572e3')

    expect(response.statusCode).toEqual(200)
    expect(response.body._id == "6432f9226cce2fc1706572e3") 
  })

  it('Sends status code 404 if parameter projectId is an invalid mongoDb id' ,async() => {
    const response = await request(app)
    .get(URLstring + 'invalidId')

    expect(response.statusCode).toEqual(404)
    expect(response.body.project == null && response.body.msg == noProject)

  })

  it('Sends status code 404 if no project exist that matches parameter projectId' ,async() => {
    const response = await request(app)
    //Changed 3 to 9 at end of string
    .get(URLstring + '6432f9226cce2fc1706572e9')
    
    expect(response.statusCode).toEqual(404)
    expect(response.body.project == null && response.body.msg == noProject)
  })


  /********************************** 
  *        TEST /likes ROUTE        *
  **********************************/


  it('Sends status code 200 and projects sorted by likes in ascending order using getProjectsByLikes', async () => {
    const response = await request(app)
    .get(URLstring + 'likes')

    expect(response.statusCode).toEqual(200)
  })


//Last bracket
})


describe('POST Project from endpoint /api/projects/ using addNewProject', () => {

  it('Post a project successfully and expects statusCode 200 ', async () => {
    const xToken = await getToken(userSignIn)
    //Create test project
    const testProject = projectData
    
    const response = await request(app)
    .post(URLstring)
    .set('x-auth-token', xToken)
    .send(testProject)

    expect(response.statusCode).toEqual(200)
    expect(response.body.name).toEqual(testProject.name)
    projectId = response.body._id
    
  })


  it('Expects statusCode 401 When x-auth-token is not set',  async() => {
    const testProject = {
      "name": "testProject", 
      "semester": "S1 2023",
      "category": "Web Development"
    }    
    const response = await request(app)
    .post(URLstring)
    .send(testProject)
    .expect(401)

    expect(response.body.fail).toEqual(noToken)
    
  })

  it('Expects statusCode 400 When token is invalid ',  async() => {
    const testProject = {
      "name": "testProject", 
      "semester": "S1 2023",
      "category": "Web Development"
    }    
    const response = await request(app)
    .post(URLstring)
    .set('x-auth-token', 'xToken')
    .send(testProject)
    
    expect(response.statusCode).toEqual(400)
    expect(response.body.fail).toEqual(invalidToken)
  
  })


  it('Expects statusCode 403 when user is not graduate ',  async() => {
    const xToken = await (getToken(visitorSignIn))
    const testProject = {
      "name": "testProject", 
      "semester": "S1 2023",
      "category": "Web Development"
    }    
    
    const response = await request(app)
    .post(URLstring)
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
    .post(URLstring)
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
    .post(URLstring)
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
    .post(URLstring)
    .set('x-auth-token', xToken)
    .send(testProject)

    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual(invalidSemester)

  })

  it('Expects statusCode 400 semester length is incorrect',  async() => {
    const xToken = await getToken(userSignIn)
    const testProject = {
      "name": "testProject", 
      "semester": "S1 100",
      "category": "Web Development"
    }    
    const response = await request(app)
    .post(URLstring)
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
    .post(URLstring)
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
    .post(URLstring)
    .set('x-auth-token', xToken)
    .send(testProject)

    expect(response.statusCode).toEqual(400)
  })
  
  //Last brackets
})




describe('Test the /:projectId/incrementViews PATCH endpoint  using incrementViews', () => {
  
  it('Expects statusCode 200 and a project to be returned', async () => {
    const project = await Project.findById(projectId)
    const currentViewCount = project.views

    const response = await request(app)
    .patch(URLstring + `${projectId}/incrementViews`)
    
    expect(response.statusCode).toEqual(200)
    expect(response.body.views).toEqual(currentViewCount + 1)
  })

  it('Expects statusCode 404 and project = null and a err msg', async () => {

    const response = await request(app)
    .patch(URLstring + `23904a23499s/incrementViews`)
    
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })

})

describe('Test the POST comment ~ /comment using writeComment', () => {
  
  it('Expects statusCode 200 and a project with the comment added', async () => {
  const xToken = await getToken(visitorSignIn)

  const commentResponse = await request(app)
  .post(URLstring + 'comment')
  .set('x-auth-token', xToken)
  .send({
    "projectId": projectId,
    "commentBody": "comment1"
  })
  commentUser = commentResponse.body._id
  await request(app)
  .post(URLstring + 'comment')
  .set('x-auth-token', xToken)
  .send({
    "projectId": projectId,
    "commentBody": "comment2"
  })

  const response = await request(app)
  .post(URLstring + 'comment')
  .set('x-auth-token', xToken)
  .send({
    "projectId": projectId,
    "commentBody": "Hello There"
  })
  expect(response.statusCode).toEqual(200)
  expect(response.body.commentBody).toEqual("Hello There")
  commentId = response.body._id
  const commentUserID = response.body.user.username

  expect(commentUserID).toEqual(visitorSignIn.username)

  })

  it('Expects statusCode 400 when body of comment is invalid', async () => {
    const xToken = await getToken(visitorSignIn)
    const response = await request(app)
    .post(URLstring + 'comment')
    .set('x-auth-token', xToken)
    .send({
      "projectId": projectId,
      "commentBod": "Hello There"
    })
    expect(response.statusCode).toEqual(400)
    expect(response.body.project).toEqual(null)
  })

  it('Expects statusCode 401 when no token is sent', async () => {
    const response = await request(app)
    .post(URLstring + 'comment')
    .send({
      "projectId": projectId,
      "commentBody": "Hello There"

    })

    expect(response.statusCode).toEqual(401)
    expect(response.body.fail).toEqual(noToken)
  })



    it('Expects statusCode 400 when invalid token is sent', async () => {
      const response = await request(app)
      .post(URLstring + 'comment')
      .set('x-auth-token', 'BadToken')
      .send({
        "projectId": projectId,
        "commentBody": "Hello There"
      })


      expect(response.statusCode).toEqual(400)
      expect(response.body.fail).toEqual(invalidToken)
    })


    
    it('Expects statusCode 404 when projectId does not find project', async () => {
      const xToken = await getToken(visitorSignIn)
      const response = await request(app)
      .post(URLstring + 'comment')
      .set('x-auth-token', xToken)
      .send({
        "projectId": '6456fef4adc5d63f86fbec1e',
        "commentBody": "Hello There"
      })

      expect(response.statusCode).toEqual(404)
      expect(response.body.msg).toEqual(noProject)
    })
  

})


describe('Test that retrieves comments using GET endoiunbt /comments/all using getAllComments', () => {
  it('Expects statusCode 200 and all comments from all projects', async () => {
    const response = await request(app)
    .get(URLstring + 'comments/all')
    expect(response.statusCode).toEqual(200)
  })

  it('Expects statusCode 200 and all comments for a specific project from /comments/:projectId', async () => {
    const response = await request(app)
    .get(URLstring + `comments/${projectId}`)

    expect(response.statusCode).toEqual(200)
  })
  
  it('Expects statusCode 404 and err msg from /comments/:projectId', async () => {
    const response = await request(app)
    .get(URLstring + `comments/invalidId`)

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })
})


describe('Test the deleteComment DELETE endpoint ~ /comment/:commentId using deleteComment', () => {
  
  it('Expects statusCode 404 with err msg when given non-existant commentId', async () => {
    const xToken = await getToken(visitorSignIn)
    const response = await request(app)
    .delete(URLstring +`comment/6432f9226cce2fc1706572e3`)
    .set('x-auth-token', xToken)
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual('No comment exist')
  })
  
  it('Expects statusCode 404 with err msg when given an invalid commentId', async () => {
    const xToken = await getToken(visitorSignIn)
    const response = await request(app)
    .delete(URLstring +`comment/invalidId`)
    .set('x-auth-token', xToken)
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual('No comment exist')
  })
  

  it('Expects statusCode 401 with no token given ', async () => {
    const response = await request(app)
    .delete(URLstring +`comment/${commentId}`)
    expect(response.statusCode).toEqual(401)
    expect(response.body.fail).toEqual(noToken)
  })

  it('Expects statusCode 400 with invalid token ', async () => {
    const response = await request(app)
    .delete(URLstring +`comment/${commentId}`)
    .set('x-auth-token', 'visitorSignIn')
    expect(response.statusCode).toEqual(400)
    expect(response.body.fail).toEqual(invalidToken)
  })


  it('Expects statusCode 403 when comment being deleted does not belong to user ', async () => {
    const xToken = await getToken(userSignIn)

    const response = await request(app)
    .delete(URLstring +`comment/${commentId}`)
    .set('x-auth-token', xToken)


    expect(response.statusCode).toEqual(403)
    expect(response.body.msg).toEqual(notYourComment)
  })


  it('Expects statusCode 200 with the comment being null ', async () => {
    const xToken = await getToken(adminSignin)

    const response = await request(app)
    .delete(URLstring +`comment/${commentId}`)
    .set('x-auth-token', xToken)


    expect(response.statusCode).toEqual(200)

    const comment = await Comment.findById(commentId)
    expect(comment).toEqual(null)
  })
})


describe('Test the like project PATCH endpoint using likeComment ', () => {

  it('Expects statusCode 401 with no token given ', async () => {
    const response = await request(app)
    .patch(URLstring +`${projectId}/like`)
    expect(response.statusCode).toEqual(401)
    expect(response.body.fail).toEqual(noToken)
  })

  it('Expects statusCode 400 with invalid token ', async () => {
    const response = await request(app)
    .patch(URLstring + `${projectId}/like`)
    .set('x-auth-token', 'visitorSignIn')
    expect(response.statusCode).toEqual(400)
    expect(response.body.fail).toEqual(invalidToken)
  })

  it('Expects statusCode 404 and from invalid projectId', async () => {
    const xToken = await getToken(visitorSignIn)
    const response = await request(app)
    .patch(URLstring + `projectId/like`)
    .set('x-auth-token', xToken)
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })

  it('Expects statusCode 404 and from nonexistant project', async () => {
    const xToken = await getToken(visitorSignIn)
    const response = await request(app)
    .patch(URLstring + `643f2c55ad1a82d723b5b875/like`)
    .set('x-auth-token', xToken)
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })

  it('Expects statusCode 403 and from err message from user thats part of project', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .patch(URLstring + `${projectId}/like`)
    .set('x-auth-token', xToken)
    expect(response.statusCode).toEqual(403)
    expect(response.body.msg).toEqual("You are not allowed to like your own project")
  })


  it('Expects statusCode 200 and likes equal previouslikes + 1', async () => {
    const xToken = await getToken(visitorSignIn)
    const likes = (await Project.findById(projectId)).likes
    const response = await request(app)

    .patch(URLstring + `${projectId}/like`)
    .set('x-auth-token', xToken)
    expect(response.statusCode).toEqual(200)
    expect(response.body.likes).toEqual(likes + 1)

  })

  it('Expects statusCode 200 and likes equal previouslikes - 1', async () => {
    const xToken = await getToken(visitorSignIn)
    const likes = (await Project.findById(projectId)).likes
    const response = await request(app)
    .patch(URLstring + `${projectId}/like`)
    .set('x-auth-token', xToken)
    expect(response.statusCode).toEqual(200)
    expect(response.body.likes).toEqual(likes - 1)
  })

})


describe('Test the PATCH /:projectId route where it uses updateProjectById endpoint', () => {
  it('Expects statusCode 200 and updated project', async() => {
    const xToken = await getToken(userSignIn)
    const patchBody = {
      "name" : "testProject"
    }
    const response = await request(app)
    .patch(URLstring + projectId)
    .set('x-auth-token', xToken)
    .send(patchBody)
    
    expect(response.statusCode).toEqual(200)
    expect(response.body.name).toEqual(patchBody.name)
  })

  it('Expects statusCode 404 when projectId is an invalid id', async() => {
    const xToken = await getToken(userSignIn)
    const patchBody = {
      "name" : "testProject"
    }
    const response = await request(app)
    .patch(URLstring + 'invalidId')
    .set('x-auth-token', xToken)
    .send(patchBody)
    
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })

  it('Expects statusCode 404 when project is not found', async() => {
    const xToken = await getToken(userSignIn)
    const patchBody = {
      "name" : "testProject"
    }
    const response = await request(app)
    .patch(URLstring + '6456fef4adc5d63f86fbec1e')
    .set('x-auth-token', xToken)
    .send(patchBody)
    
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })

  it('Expects statusCode 400 when token is invalid', async () => {
    const xToken = await getToken(userSignIn)
    const patchBody = {
      "name" : "testProject"
    }
    const response = await request(app)
    .patch(URLstring + projectId)
    .set('x-auth-token', 'xToken')
    .send(patchBody)

    expect(response.statusCode).toEqual(400)
    expect(response.body.fail).toEqual(invalidToken)
    
  })

  it('Expects statusCode 401 when token is not given', async () => {
    const xToken = await getToken(userSignIn)
    const patchBody = {
      "name" : "testProject"
    }
    const response = await request(app)
    .patch(URLstring + projectId)
    .send(patchBody)

    expect(response.statusCode).toEqual(401)
    expect(response.body.fail).toEqual(noToken)
    
  })

  it('Expects statusCode 403 when user is not a graduate', async () => {
    const xToken = await getToken(visitorSignIn)
    const patchBody = {
      "name" : "testProject"
    }
    const response = await request(app)
    .patch(URLstring + projectId)
    .set('x-auth-token', xToken)
    .send(patchBody)



    expect(response.statusCode).toEqual(403)
    expect(response.text).toEqual(notGraduate)
    
  })
  it('Expects statusCode 403 when a user is not part of the project ', async () => {
    const xToken = await getToken(userSignIn2)
    const patchBody = {
      "name" : 'testProject',
      "badge" : 'Top Excellence'
    }
    const response = await request(app)
    .patch(URLstring + projectId)
    .set('x-auth-token', xToken)
    .send(patchBody)

    expect(response.statusCode).toEqual(403)
    expect(response.body.msg).toEqual("You are not part of this project")
  })

  it('Expects statusCode 400 from an semester that doesnt exist', async () => {
    const xToken = await getToken(userSignIn)
    const patchBody = {
      "name" : 'testProject',
      "semester" : 'S3 1234'
    }
    const response = await request(app)
    .patch(URLstring + projectId)
    .set('x-auth-token', xToken)
    .send(patchBody)

    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual(invalidSemester)
  })

  it('Expects statusCode 400 from an invalid semester', async () => {
    const xToken = await getToken(userSignIn)
    const patchBody = {
      "name" : 'testProject',
      "semester" : 'S3 202'
    }
    const response = await request(app)
    .patch(URLstring + projectId)
    .set('x-auth-token', xToken)
    .send(patchBody)

    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual(invalidSemester)
  })

  it('Expects statusCode 400 from an invalid category', async () => {
    const xToken = await getToken(userSignIn)
    const patchBody = {
      "name" : 'testProject',
      "category" : 'S3 202'
    }
    const response = await request(app)
    .patch(URLstring + projectId)
    .set('x-auth-token', xToken)
    .send(patchBody)

    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual('Invalid category!')
  })


  
  it('Expects statusCode 403 when a user is not an admin and tries to update badge', async () => {
    const xToken = await getToken(userSignIn)
    const patchBody = {
      "name" : 'testProject',
      "badges" : 'Top Excellence'
    }
    const response = await request(app)
    .patch(URLstring + projectId)
    .set('x-auth-token', xToken)
    .send(patchBody)

    expect(response.statusCode).toEqual(403)
    expect(response.body.msg).toEqual("Only admins can update project badges!")

  })
  

  it('Expects statusCode 400 when a user is admin and tries to award an invalid badge', async () => {
    const xToken = await getToken(adminSignin)

    const patchBody = {
      "name" : 'testProject',
      "badges" : 'Top Excell'
    }
    const response = await request(app)
    .patch(URLstring + projectId)
    .set('x-auth-token', xToken)
    .send(patchBody)

    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual(invalidAward)
  })
  
})






describe('Adds user to project using PUT endpoint /:id/:userid using addUserToProject', () =>{
  
  it('Expects statusCode 404 for invalid userId ', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .put(URLstring + `${projectId}/invalidUserId`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noUser)
  })

  it('Expects statusCode 404 for no existing user from userId ', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .put(URLstring + `${projectId}/64572fd1f66d6a2ad42c394b`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noUser)
  })

  it('Expects statusCode 404 for invalid id ', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .put(URLstring + `wrongProjectId/${userId2}`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })

  it('Expects statusCode 404 for no existing project from id ', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .put(URLstring + `64572fd1f66d6a2ad42c394r/${userId2}`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })

  it('Expects statusCode 403 if the user adding the user is not part of the project or not admin ', async () => {
    const xToken = await getToken(userSignIn2)
    const response = await request(app)
    .put(URLstring + `${projectId}/${userId2}`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(403)
    expect(response.body.msg).toEqual("You do not belong to the project you are appending another user to!")
  })

  it('Expects statusCode 400 if the user is trying to add themselves to the project ', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .put(URLstring + `${projectId}/${userId}`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual("You already belong to the project!")
  })

  it('Expects statusCode 200 with project being returned with the id added', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .put(URLstring + `${projectId}/${userId2}`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(200)
    expect(response.body.members.includes(userId2))
  })
  
  it('Expects statusCode 400 if the user being added is already added ', async () => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .put(URLstring + `${projectId}/${userId2}`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual('This user already belongs to the project!')
  })


})



describe('test the award badge PATCH endpoint badges/award using awardBadge', () =>{

  it('Expects statusCode 404 from invalid projectId', async () => {
    const awardProject = {
      "projectId" : 'wrongProjectId',
      "award": 'Top Excellence'
    }

    const xToken = await getToken(adminSignin)
    const response = await request(app)
    .patch(URLstring + 'badges/award')
    .set('x-auth-token', xToken)
    .send(awardProject)

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })

  it('Expects statusCode 404 from non existant project', async () => {
    const xToken = await getToken(adminSignin)
    const awardProject = {
      "projectId" : '6432f8826cce2fc1706572d3',
      "award": 'Top Excellence'
    }

    const response = await request(app)
    .patch(URLstring + 'badges/award')
    .set('x-auth-token', xToken)
    .send(awardProject)
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })

  it('Expects statusCode 401 When x-auth-token is not set',  async() => {
    const awardProject = {
      "projectId" : `${projectId}`,
      "award": 'Top Excellence'
    }
    const response = await request(app)
    .patch(URLstring + 'badges/award')
    .send(awardProject)
    expect(response.statusCode).toEqual(401)
    expect(response.body.fail).toEqual(noToken)
    
  })

  it('Expects statusCode 400 When token is invalid ',  async() => {
    const awardProject = {
      "projectId" : `${projectId}`,
      "award": 'Top Excellence'
    }
    const response = await request(app)
    .patch(URLstring + 'badges/award')
    .set('x-auth-token', 'xToken')
    .send(awardProject)

    expect(response.statusCode).toEqual(400)
  
    expect(response.body.fail).toEqual(invalidToken)
  })

  it('Expects statusCode 403 user is not admin',  async() => {
    const awardProject = {
      "projectId" : `${projectId}`,
      "award": 'Top Excellence'
    }
    const xToken = await getToken(visitorSignIn)

    const response = await request(app)
    .patch(URLstring + 'badges/award')
    .set('x-auth-token', xToken)
    .send(awardProject)

    expect(response.statusCode).toEqual(403)
    expect(response.body.fail).toEqual(notAdmin)
    
  })

  it('Expects statusCode 400 when badge is invalid',  async() => {
    const awardProject = {
      "projectId" : `${projectId}`,
      "badges": 'Top Excell'
    }
    const xToken = await getToken(adminSignin)
    const response = await request(app)
    .patch(URLstring + 'badges/award')
    .set('x-auth-token', xToken)
    .send(awardProject)
    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual(invalidAward)
    
  })

  it('Expects statusCode 200 when badge is valid',  async() => {
    const awardProject = {
      "projectId" : `${projectId}`,
      "award": 'Top Excellence'
    }
    const xToken = await getToken(adminSignin)
    const response = await request(app)
    .patch(URLstring + 'badges/award')
    .set('x-auth-token', xToken)
    .send(awardProject)
    expect(response.statusCode).toEqual(200)
    
  })
})




//This endpoint 200 test may change depending on projects which have awards
describe('Test the GET /badges/:badge endpoint using getProjectByBadge', () =>{

  it('Expects 204 from an invalid badge', async () => {
    const response = await request(app)
    .get(URLstring + `badges/Top Excellenc`)
    
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual("No badge found!")
  })


  it('Expects 204 from an invalid badge', async () => {
    const response = await request(app)
    .get(URLstring + `badges/TopExcellence`)
    
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual("No badge found!")
  })


  it('Expects 200 from an Top Excellence badge', async () => {
    const response = await request(app)
    .get(URLstring + `badges/Top Excellence`)
    
    expect(response.statusCode).toEqual(200)
  })

  it('Expects 200 from an Peoples Choice badge', async () => {
    const response = await request(app)
    .get(URLstring + `badges/Peoples Choice`)
    
    expect(response.statusCode).toEqual(200)
  })

  it('Expects 200 from an Community Impact badge', async () => {
    const response = await request(app)
    .get(URLstring + `badges/Community Impact`)
    
    expect(response.statusCode).toEqual(200)
  })
})




/**********************************************************************************************
*
*                                         TEST THE SEARCH ENDPOINT 
* 
***********************************************************************************************/
describe('Test the GET search function using /search with keyword using searchProjects', () =>{
  it('Expects 200 and at least 1 project to be returned when query is keyword : projectName', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({keyword: projectData.name})

    expect(response.statusCode).toEqual(200)
    expect(response.body.length == 1)
  })

  it('Expects 200 and at least 1 project to be returned when query is keyword : tag superCool', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({keyword: 'superCool'})

    expect(response.statusCode).toEqual(200)
    expect(response.body.length == 1)
  })


})

describe('Test the GET search function using /search with query parameters being category', () =>{
  it('Expects 200 and at least 1 project to be returned when query is category : Mobile development', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({category: projectData.category})

    expect(response.statusCode).toEqual(200)
    expect(response.body.length > 0 )
  })

  it('Expects 200 and at least 1 project to be returned when query is category : mo', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({category: 'mo'})

    expect(response.statusCode).toEqual(200)
    expect(response.body.length > 0)
  })

  it('Expects 404 when query is category and invalid', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({category: 'wrong'})

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(invalidCategory)
  })
  
  it('Expects 404 when query is category and invalid', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({category: 'mobiledevelopment'})

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(invalidCategory)
  })
})

describe('Test the GET search function using /search with query parameters being semester', () =>{
  it('Expects 200 and at least 1 project to be returned when query is semester : s1 2023', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({semester: projectData.semester})

    expect(response.statusCode).toEqual(200)
    expect(response.body.length > 0 )
  })
  it('Expects 200 when query is semester : s12023', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({semester: 's12023'})

    expect(response.statusCode).toEqual(200)
    expect(response.body.length > 0 )
  })

  it('Expects 404 when query is semester and invalid', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({semester: 'wrong'})

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(invalidSemester)
  })

  it('Expects 404 when query is semester and invalid', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({semester: 's1'})

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(invalidSemester)
  })

    it('Expects 404 when query is semester and invalid', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({semester: '2023'})

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(invalidSemester)
  })

})

describe('Test the GET search function using /search with query parameters being award', () =>{
  it('Expects 200 when query is award : Top Excellence', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({award: 'Top Excellence'})

    expect(response.statusCode).toEqual(200)
    expect(response.body.length > 0)
  })

  it('Expects 404 when query is award : TopExcellence', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({award: 'TopExcellence'})

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(invalidAward)
  })

  it('Expects 404 when query is award : Top Excellenc', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({award: 'Top Excellenc'})

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(invalidAward)
  })

  it('Expects 404 when query is award : Top', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({award: 'Top'})

    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(invalidAward)
  })
})

describe('Test the sortBy query parameter', () =>{
  it('Expects 200 from sortBy=name', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({sortBy: 'name'})
    expect(response.statusCode).toEqual(200)
  })

  it('Expects 200 from sortBy=category', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({sortBy: 'category'})
    expect(response.statusCode).toEqual(200)
  })

  it('Expects 200 from sortBy=awards', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({sortBy: 'awards'})
    expect(response.statusCode).toEqual(200)
  })

  it('Expects 200 from sortBy=likes', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({sortBy: 'awards'})
    expect(response.statusCode).toEqual(200)
  })

  it('Expects 200 from sortBy=semester', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({sortBy: 'semester'})
    expect(response.statusCode).toEqual(200)
  })


  it('Expects 200 from sortBy=SEMESTER', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({sortBy: 'awards'})
    expect(response.statusCode).toEqual(200)
  })

  it('Expects 200 from sortBy=seMesTeR', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({sortBy: 'awards'})
    expect(response.statusCode).toEqual(200)
  })


  it('Expects 400 from sortBy= some invalid query', async () => {
    const response = await request(app)
    .get(URLstring + `search`)
    .query({sortBy: 'swag'})
    expect(response.statusCode).toEqual(400)
    expect(response.body.msg).toEqual('invalid query')
  })

})


describe('Test the startIndex as query', () =>{
  it('Expects 200 when start index is 0 and all projects', async () => {
    const projectCount = (await request(app)
    .get(URLstring)).body.length

    if(projectCount > 0){    
      const response = await request(app)
      .get(URLstring + 'search')
      .query({startIndex: 0})

      expect(response.statusCode).toEqual(200)
      expect(response.body.length == projectCount)
    }
  })

  it('Expects 200 when start index is valid and is length of projects which gives only one project', async () => {
    const projectCount = (await request(app)
    .get(URLstring)).body.length

    if(projectCount > 0){    
      const response = await request(app)
      .get(URLstring + 'search')
      .query({startIndex: projectCount-1})

      expect(response.statusCode).toEqual(200)
      expect(response.body.length == 1)
    }
  })

  it('Expects 200 when start index is valid and is length of projects which gives only one project', async () => {
    
    const projectCount = (await request(app)
    .get(URLstring)).body.length

    if(projectCount > 0){    
      const response = await request(app)
      .get(URLstring + 'search')
      .query({startIndex: projectCount-1})

      expect(response.statusCode).toEqual(200)
      expect(response.body.length == 1)
    }
  })

  it('Expects 200 when start index is valid and is > length of projects ', async () => {
    const projectCount = (await request(app)
    .get(URLstring)).body.length

      const response = await request(app)
      .get(URLstring + 'search')
      .query({startIndex: projectCount})

      expect(response.statusCode).toEqual(200)
      expect(response.body).toEqual([projectCount])
  })
})

//array return includes number of projects
describe('Test when /search query is numProjects', () =>{
  it('Expects 5 projects if there are 5 projects', async () => {
    const projectCount = (await request(app)
    .get(URLstring)).body.length

    if(projectCount >= 5){
      const response = await request(app)
      .get(URLstring + 'search')
      .query({numProjects: 5})

      expect(response.statusCode).toEqual(200)
      expect(response.body.length).toEqual(6)
    }
  })

    it('Expects all projects if query specifies more than projectCount', async () => {
      const projectCount = (await request(app)
      .get(URLstring)).body.length
  
      if(projectCount >= 1){
        const response = await request(app)
        .get(URLstring + 'search')
        .query({numProjects: projectCount})
  
        expect(response.statusCode).toEqual(200)
        expect(response.body.length).toEqual(projectCount+1)
      }
  })

  it('Expects all projects if query = 0', async () => {
    const projectCount = (await request(app)
    .get(URLstring)).body.length

    if(projectCount >= 1){
      const response = await request(app)
      .get(URLstring + 'search')
      .query({numProjects: 0})

      expect(response.statusCode).toEqual(200)
      expect(response.body.length).toEqual(projectCount+1)
    }
   })

  })

describe('Test the category, semester and award', () => {
  it('Expects 200 with at least 1 project', async () => {
      const response = await request(app)
      .get(URLstring + 'search')
      .query({
        category: 'Mobile Development',
        semester: 'S1 2023',
        award: 'Top Excellence'
    })
    expect(response.statusCode).toEqual(200)
  })

  it('Expects 404 with one query is invalid', async () => {
    const response = await request(app)
    .get(URLstring + 'search')
    .query({
      category: 'Mobile Development',
      semester: 'S1 2023',
      award: 'Top Excellenc'
  })
  expect(response.statusCode).toEqual(404)
  })

  it('Expects 200 when semester has no space and lowercase', async () => {
    const response = await request(app)
    .get(URLstring + 'search')
    .query({
      category: 'Mobile Development',
      semester: 's12023',
      award: 'Top Excellence'
  })
  expect(response.statusCode).toEqual(200)
  })

  it('Expects 200 when category has no space and missing a word', async () => {
    const response = await request(app)
    .get(URLstring + 'search')
    .query({
      category: 'mobile',
      semester: 's12023',
      award: 'Top Excellence'
  })
  expect(response.statusCode).toEqual(200)
  })


})

/*******************************************************************
*                 PLACE DELETE ENDPOINT AT BOTTOM                  *
*******************************************************************/
describe('Test the delete endpoint /:projectId using deleteProject', () =>{

  it('Expects statusCode 404 from invalid projectId', async () => {
    const xToken = await getToken(adminSignin)
    const response = await request(app)
    .delete(URLstring + `projectId`)
    .set('x-auth-token', xToken)
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })

  it('Expects statusCode 404 from non existant project', async () => {
    const xToken = await getToken(adminSignin)

    const response = await request(app)
    .delete(URLstring + `6432f8826cce2fc1706572d3`)
    .set('x-auth-token', xToken)
    
    expect(response.statusCode).toEqual(404)
    expect(response.body.msg).toEqual(noProject)
  })

  it('Expects statusCode 401 When x-auth-token is not set',  async() => {
    const response = await request(app)
    .delete(URLstring + `6432f8826cce2fc1706572d3`)
  
    expect(response.statusCode).toEqual(401)
    expect(response.body.fail).toEqual(noToken)
    
  })

  it('Expects statusCode 403 user is not admin',  async() => {
    const xToken = await getToken(userSignIn)
    const response = await request(app)
    .delete(URLstring + `${projectId}`)
    .set('x-auth-token', xToken)

    expect(response.statusCode).toEqual(403)
    expect(response.body.fail).toEqual(notAdmin)
    
  })

  it('Expects statusCode 400 When token is invalid ',  async() => {
    const response = await request(app)
    .delete(URLstring + `${projectId}`)
    .set('x-auth-token', 'xToken')

    expect(response.statusCode).toEqual(400)  
    expect(response.body.fail).toEqual(invalidToken)
  })

    
  it('Expects statusCode 200 and project deleted',  async() => {
    const lengthOfProjects = (await Project.find()).length

    const xToken = await getToken(adminSignin)
    const response = await request(app)
    .delete(URLstring + `${projectId}`)
    .set('x-auth-token', xToken)
    

    const findProject = await Project.findById(projectId)
    
    const userInProject = await User.findById(userId)
    const commentsInProject = await Comment.find({project: projectId})

    expect(response.statusCode).toEqual(200)
    expect(response.body.length == lengthOfProjects - 1)
    expect(findProject).toEqual(null)
    expect(userInProject.project).toEqual(null)
    expect(commentsInProject).toEqual([])
    expect(userInProject.myComments.includes(commentUser)).toEqual(false)
  })
  
})

/* 

describe('', () =>{

})


it('', async () => {

})
*/
