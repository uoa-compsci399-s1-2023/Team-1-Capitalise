const app = require("../app");
const request = require("supertest");
const { User, validate } = require("../models/user");
const { Project } = require("../models/project");
const { Parameter } = require("../models/parameter");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const deleteObjects = [];

afterAll(async () => {
  await Promise.all(deleteObjects);
});

describe("FETCH all parameters", () => {
  it("Sends a 200 response if all categories are fetched", async () => {
    await request(app)
      .get("/api/parameters/categories")
      .expect(200)
      .then((response) => {
        response.body.forEach((element) => {
          expect(element.parameterType).toBe("category");
        });
      });
  });
  it("Sends a 200 response if all categories are fetched", async () => {
    await request(app)
      .get("/api/parameters/categories")
      .expect(200)
      .then((response) => {
        response.body.forEach((element) => {
          expect(element.parameterType).toBe("category");
        });
      });
  });
  it("Sends a 200 response if all semesters are fetched", async () => {
    await request(app)
      .get("/api/parameters/semesters")
      .expect(200)
      .then((response) => {
        response.body.forEach((element) => {
          expect(element.parameterType).toBe("semester");
          expect(element.value.length).toEqual(7);
        });
      });
  });
  it("Sends a 200 response if all sortBys are fetched", async () => {
    await request(app)
      .get("/api/parameters/sortBys")
      .expect(200)
      .then((response) => {
        response.body.forEach((element) => {
          expect(element.parameterType).toBe("sortBy");
        });
      });
  });
  it("Sends a 200 response if all awards (badges) are fetched", async () => {
    await request(app)
      .get("/api/parameters/awards")
      .expect(200)
      .then((response) => {
        response.body.forEach((element) => {
          expect(element.parameterType).toBe("award");
        });
      });
  });
});

describe("POST categories", () => {
  it("Sends a 201 response if a category is created", async () => {
    await request(app)
      .post("/api/parameters")
      .set("x-auth-token", process.env.ANDREWTOKEN)
      .send({
        value: "Robotics",
        parameterType: "category",
      })
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body.value).toBe("Robotics");
        expect(response.body.parameterType).toBe("category");
        deleteObjects.push(
          await Parameter.findByIdAndDelete(response.body._id)
        );
      });
  });
  it("Capitalises all words in the value parameter", async () => {
    await request(app)
      .post("/api/parameters")
      .set("x-auth-token", process.env.ANDREWTOKEN)
      .send({
        value: "cloud computing",
        parameterType: "category",
      })
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body.value).toBe("Cloud Computing");
        expect(response.body.parameterType).toBe("category");
        deleteObjects.push(
          await Parameter.findByIdAndDelete(response.body._id)
        );
      });
  });
});

describe("POST semesters", () => {
  it("Sends a 201 response if a semester is created", async () => {
    await request(app)
      .post("/api/parameters")
      .set("x-auth-token", process.env.ANDREWTOKEN)
      .send({
        value: "S2 2098",
        parameterType: "semester",
      })
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body.value).toBe("S2 2098");
        expect(response.body.parameterType).toBe("semester");
        deleteObjects.push(
          await Parameter.findByIdAndDelete(response.body._id)
        );
      });
  });
  it("Capitalises the S in Semester of the value of the semester", async () => {
    await request(app)
      .post("/api/parameters")
      .set("x-auth-token", process.env.ANDREWTOKEN)
      .send({
        value: "s1 2099",
        parameterType: "semester",
      })
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body.value).toBe("S1 2099");
        expect(response.body.parameterType).toBe("semester");
        deleteObjects.push(
          await Parameter.findByIdAndDelete(response.body._id)
        );
      });
  });
  it("Prevents creating semesters of any format other than SX 20YY", async () => {
    await request(app)
      .post("/api/parameters")
      .set("x-auth-token", process.env.ANDREWTOKEN)
      .send({
        value: "Semester 2 2021",
        parameterType: "semester",
      })
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.fail).toBe(
          "Semesters must take on the form of SX 20YY"
        );
      });
  });
});

describe("POST awards", () => {
  it("Sends a 201 response if an award is created", async () => {
    await request(app)
      .post("/api/parameters")
      .set("x-auth-token", process.env.ANDREWTOKEN)
      .send({
        value: "Deka Award",
        parameterType: "award",
      })
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body.value).toBe("Deka Award");
        expect(response.body.parameterType).toBe("award");
        deleteObjects.push(
          await Parameter.findByIdAndDelete(response.body._id)
        );
      });
  });
  it("Capitalises all words in the value parameter", async () => {
    await request(app)
      .post("/api/parameters")
      .set("x-auth-token", process.env.ANDREWTOKEN)
      .send({
        value: "aWS award",
        parameterType: "award",
      })
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body.value).toBe("AWS Award");
        expect(response.body.parameterType).toBe("award");
        deleteObjects.push(
          await Parameter.findByIdAndDelete(response.body._id)
        );
      });
  });
});

describe("DELETE parameters", () => {
  it("Sends a 200 response if a parameter is succesfully deleted", async () => {
    let awardId = "";
    let awardValue = "";
    await request(app)
      .post("/api/parameters")
      .set("x-auth-token", process.env.ANDREWTOKEN)
      .send({
        value: "Deka Award 2",
        parameterType: "award",
      })
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body.value).toBe("Deka Award 2");
        expect(response.body.parameterType).toBe("award");
        awardId = response.body._id;
        awardValue = response.body.value;
      });
    await request(app)
      .delete(`/api/parameters/${awardId}`)
      .set("x-auth-token", process.env.ANDREWTOKEN)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.removed).toBe(`${awardValue} removed`);
      });
  });
  it("Sends a 400 response if an admin attempts to delete the category Miscellaneous", async () => {
    await request(app)
      .delete(`/api/parameters/645f15c6709ff2247f0d3921`)
      .set("x-auth-token", process.env.ANDREWTOKEN)
      .expect(400)
      .then((response) => {
        expect(response.body.fail).toBe(
          "Error - You cannot delete this parameter! It is required by the system for error handling!"
        );
      });
  });
});

describe("POST Parameter Authentication", () => {
  it("Sends a 400 response if the x-auth-token is invalid", async () => {
    await request(app)
      .post("/api/parameters")
      .set("x-auth-token", "No Bueno")
      .expect(400)
      .then((response) => {
        expect(response.body.fail).toBe("Invalid token provided!");
      });
  });
  it("Sends a 401 response if no x-auth-token is provided", async () => {
    await request(app)
      .post(`/api/parameters`)
      .send({
        value: "aWS award",
        parameterType: "award",
      })
      .expect(401)
      .then((response) => {
        expect(response.body.fail).toBe("Access denied. No token provided.");
      });
  });
  it("Sends a 403 response if a non-admin user attempts to post a parameter", async () => {
    await request(app)
      .post("/api/parameters")
      .set("x-auth-token", process.env.RACHELTOKEN)
      .send({
        value: "aWS award",
        parameterType: "award",
      })
      .expect(403)
      .then((response) => {
        expect(response.body.fail).toBe("Access Denied.");
      });
  });
});
