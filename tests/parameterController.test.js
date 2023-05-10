const app = require("../app");
const request = require("supertest");
const { User, validate } = require("../models/user");
const { Project } = require("../models/project");
const { Parameter } = require("../models/parameter");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();


const deleteObjects = []

afterAll(async () => {
    await Promise.all(deleteObjects)
})


describe("FETCH all parameters", () => {
    it("Sends a 200 response if all categories are fetched", async () => {
        await request(app)
            .get("/api/parameters/categories")
            .expect(200)
            .then((response) => {
                response.body.forEach(element => {
                    expect(element.parameterType).toBe("category")
                });
            });
    });
    it("Sends a 200 response if all categories are fetched", async () => {
        await request(app)
            .get("/api/parameters/categories")
            .expect(200)
            .then((response) => {
                response.body.forEach(element => {
                    expect(element.parameterType).toBe("category")
                });
            });
    });
    it("Sends a 200 response if all semesters are fetched", async () => {
        await request(app)
            .get("/api/parameters/semesters")
            .expect(200)
            .then((response) => {
                response.body.forEach(element => {
                    expect(element.parameterType).toBe("semester")
                    expect(element.value.length).toEqual(7)
                });
            });
    });
    it("Sends a 200 response if all sortBys are fetched", async () => {
        await request(app)
            .get("/api/parameters/sortBys")
            .expect(200)
            .then((response) => {
                response.body.forEach(element => {
                    expect(element.parameterType).toBe("sortBy")
                });
            });
    });
    it("Sends a 200 response if all awards (badges) are fetched", async () => {
        await request(app)
            .get("/api/parameters/awards")
            .expect(200)
            .then((response) => {
                response.body.forEach(element => {
                    expect(element.parameterType).toBe("award")
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
                parameterType: "category"
            })
            .expect(201).then(async (response) => {
                // Check the response
                expect(response.body.value).toBe("Robotics")
                expect(response.body.parameterType).toBe("category")
                deleteObjects.push(await Parameter.findByIdAndDelete(response.body._id))
            });
    });
    it("Capitalises all words in the value parameter", async () => {
        await request(app)
            .post("/api/parameters")
            .set("x-auth-token", process.env.ANDREWTOKEN)
            .send({
                value: "cloud computing",
                parameterType: "category"
            })
            .expect(201).then(async (response) => {
                // Check the response
                expect(response.body.value).toBe("Cloud Computing")
                expect(response.body.parameterType).toBe("category")
                deleteObjects.push(await Parameter.findByIdAndDelete(response.body._id))
            });
    });
});

describe("POST semesters", () => {
    it("Sends a 201 response if a semester is created", async () => {
        await request(app)
            .post("/api/parameters")
            .set("x-auth-token", process.env.ANDREWTOKEN)
            .send({
                value: "S2 2023",
                parameterType: "semester"
            })
            .expect(201).then(async (response) => {
                // Check the response
                expect(response.body.value).toBe("S2 2023")
                expect(response.body.parameterType).toBe("semester")
                deleteObjects.push(await Parameter.findByIdAndDelete(response.body._id))
            });
    });
    it("Capitalises the S in Semester of the value of the semester", async () => {
        await request(app)
            .post("/api/parameters")
            .set("x-auth-token", process.env.ANDREWTOKEN)
            .send({
                value: "s1 2024",
                parameterType: "semester"
            })
            .expect(201).then(async (response) => {
                // Check the response
                expect(response.body.value).toBe("S1 2024")
                expect(response.body.parameterType).toBe("semester")
                deleteObjects.push(await Parameter.findByIdAndDelete(response.body._id))
            });
    });
    it("Prevents creating semesters of any format other than SX 20YY", async () => {
        await request(app)
            .post("/api/parameters")
            .set("x-auth-token", process.env.ANDREWTOKEN)
            .send({
                value: "Semester 2 2021",
                parameterType: "semester"
            })
            .expect(400).then(async (response) => {
                // Check the response
                expect(response.body.fail).toBe("Semesters must take on the form of SX 20YY");
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
                parameterType: "award"
            })
            .expect(201).then(async (response) => {
                // Check the response
                expect(response.body.value).toBe("Deka Award")
                expect(response.body.parameterType).toBe("award")
                deleteObjects.push(await Parameter.findByIdAndDelete(response.body._id))
            });
    });
    it("Capitalises all words in the value parameter", async () => {
        await request(app)
            .post("/api/parameters")
            .set("x-auth-token", process.env.ANDREWTOKEN)
            .send({
                value: "aWS award",
                parameterType: "award"
            })
            .expect(201).then(async (response) => {
                // Check the response
                expect(response.body.value).toBe("AWS Award")
                expect(response.body.parameterType).toBe("award")
                deleteObjects.push(await Parameter.findByIdAndDelete(response.body._id))
            });
    });
});