const request = require('supertest')
const app = require('../app')

const { Project, validateProject} = require("../models/project");
const mongoose = require("mongoose");

const invalidProjectId = "No project found with that projectId."

describe("Test that fetches projects", () => {
  it("Sends a 200 response if all projects are fetched", async () => {
    await request(app)
      .get("/api/projects/")
      .expect(200)
      .then((response) => {
        // Check the response type and length. Assume there are more than 1 project in the database.
        expect(response.body.projects.length).toBeGreaterThan(1);
      });
  });


  /*Test getProject route */
  it('Sends status code 200 if a project\'s id matches parameter projectId' ,async() => {
    await request(app)
    .get('/api/projects/6432f9226cce2fc1706572e3')
    .expect(200)
    .then(response => {
        expect(response.body.project._id == "6432f9226cce2fc1706572e3") 
    })
  })

  it('Sends status code 404 if parameter projectId is an invalid mongoDb id' ,async() => {
    await request(app)
    .get('/api/projects/invalidId')
    .expect(404)
    .then(response => {
        expect(response.body.project == null && response.body.msg == invalidProjectId)
    })

  })

  it('Sends status code 404 if no project exist that matches parameter projectId' ,async() => {
    await request(app)
    //Changed 3 to 9 at end of string
    .get('/api/projects/6432f9226cce2fc1706572e9')
    .expect(404)
    .then(response => {
        expect(response.body.project == null && response.body.msg == invalidProjectId)
    })
  })
});