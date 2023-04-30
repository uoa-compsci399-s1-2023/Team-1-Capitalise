const app = require("../app");
const request = require("supertest");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");

describe("Fetches all users", () => {
  it("Sends a 200 response if all users are fetched", async () => {
    await request(app)
      .get("/api/users/")
      .expect(200)
      .then((response) => {
        // Check the response type and length. Assume there are more than 4 users in the database.
        expect(response.body.length).toBeGreaterThan(4);
      });
  });
});

describe("GET User by ID", () => {
  it("Sends a 200 response if the user with ID UserID is found", async () => {
    await request(app)
      .get("/api/users/user/6432f8826cce2fc1706572d3")
      .expect(200)
      .then((response) => {
        // Check the response type and length
        //expect(response.body.length).toEqual(1)

        // Check the response data
        expect(response.body.username).toBe("alin952@aucklanduni.ac.nz");
      });
  });
  it("Sends a 400 response if the userID is not valid", async () => {
    await request(app)
      .get("/api/users/user/notvalid")
      .expect(400)
      .then((response) => {
        expect(response.body.fail).toBe("notvalid is not a valid ID!");
      });
  });
  it("Sends a 404 response if the userID is valid but no user exists with userID", async () => {
    await request(app)
      .get("/api/users/user/6432f8826cce2fc1706572d4")
      .expect(404)
      .then((response) => {
        expect(response.body.fail).toBe(
          "no user with id 6432f8826cce2fc1706572d4 found!"
        );
      });
  });
});

describe("GET user via Search", () => {
  it("Sends a 200 response if a user with name :name is found", async () => {
    await request(app)
      .get("/api/users/search?name=lucas")
      .expect(200)
      .then((response) => {
        // Check the response type and length
        expect(response.body.length).toBeGreaterThanOrEqual(1);

        // Check the response data
        expect(response.body).toEqual(
          // 1
          expect.arrayContaining([
            // 2
            expect.objectContaining({
              // 3
              name: expect.stringContaining("Lucas"), // 4
            }),
          ])
        );
      });
  });
  it("Sends an empty array if no user is found with keywords", async () => {
    await request(app)
      .get("/api/users/search?name=noexistsance")
      .expect(200)
      .then((response) => {
        // Check the response type and length
        expect(response.body.length).toEqual(0);
      });
  });
  it("Sends an array of all users if any other params are used", async () => {
    await request(app)
      .get("/api/users/search?randomparam=hi")
      .expect(200)
      .then((response) => {
        // Check the response type and length
        expect(response.body.length).toBeGreaterThan(10);
      });
  });
});

describe("POST user", () => {
  it("POSTS a user of type VISITOR and checks if the response matches AND the db is consistent", async () => {
    const data = {
      name: "My New Test User",
      email: "testuser12@gmail.com",
      password: "test",
      links: [
        {
          type: "github",
          value: "https://www.github.com/testuser12",
        },
      ],
      skills: ["C#", "Cooking Pancakes"],
    };

    await request(app)
      .post("/api/users")
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body.name).toEqual(data.name);
        expect(response.body.email).toEqual(data.email);
        expect(response.body.username).toEqual(data.email);
        expect(response.body.password).not.toEqual(data.password);
        expect(response.body.skills).toEqual(data.skills);
        expect(response.body.profilePicture).toBeTruthy();
        expect(response.body.userType).toEqual("visitor");
        expect(response.body.isGoogleCreated).toBe(false);


        // Check the data in the database
        const user = await User.findOne({ _id: response.body._id });
        expect(user).toBeTruthy();
        expect(user.name).toEqual(data.name);
        expect(user.email).toEqual(data.email);
        expect(user.username).toEqual(data.email);
        expect(user.password).not.toEqual(data.password);
        expect(user.skills).toEqual(data.skills);
        expect(user.profilePicture).toBeTruthy();
        expect(user.userType).toEqual("visitor");
        expect(user.isGoogleCreated).toBe(false);

      });
  });
  it("Returns a 400 error if the email already exists in the database", async () => {
    const data = {
      name: "My New Test User",
      email: "testuser12@gmail.com",
      password: "test",
      links: [
        {
          type: "github",
          value: "https://www.github.com/testuser12",
        },
      ],
      skills: ["C#", "Cooking Pancakes"],
    };

    await request(app)
      .post("/api/users")
      .send(data)
      .expect(400)
      .then(async (response) => {
        expect(response.body.fail).toBe(
            "Email testuser12@gmail.com already exists!"
          );
      });
  });
});
