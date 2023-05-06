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

describe("GET Current User", () => {
  it("Sends a 200 response if the user with a valid x-auth-token is found", async () => {
    await request(app)
      .get("/api/users/getCurrentUser/me")
      .set(
        "x-auth-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDNlMGMyYjZlMmUxYTQwNTZhNWQ1ZDYiLCJ1c2VybmFtZSI6InRlc3RAbWFub3guY29tIiwidXNlclR5cGUiOiJncmFkdWF0ZSIsImlhdCI6MTY4MjMyNjE5MSwiZXhwIjoxNjg0OTE4MTkxfQ.ymW7Tzg9M8qA5_hjfzQhAvvT8_XL8h10r7jBklwNCMA"
      )
      .expect(200)
      .then((response) => {
        expect(response.body.username).toBe("test@manox.com");
      });
  });
  it("Sends a 400 response if the x-auth-token is invalid", async () => {
    await request(app)
      .get("/api/users/getCurrentUser/me")
      .set("x-auth-token", "No Bueno")
      .expect(400)
      .then((response) => {
        expect(response.body.fail).toBe("Invalid token provided!");
      });
  });
  it("Sends a 401 response if no x-auth-token is provided", async () => {
    await request(app)
      .get("/api/users/getCurrentUser/me")
      .expect(401)
      .then((response) => {
        expect(response.body.fail).toBe("Access denied. No token provided.");
      });
  });
});

/*
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
      .expect(201)
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

        //Check if there is an x-auth-token
        expect(response.headers["x-auth-token"]).toBeTruthy();
      });
  });
  it("POSTS a user of type GRADUATE and checks if the response matches AND the db is consistent", async () => {
    const data = {
      name: "My New Graduate Test User",
      email: "testuser12@aucklanduni.ac.nz",
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
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body.name).toEqual(data.name);
        expect(response.body.email).toEqual(data.email);
        expect(response.body.username).toEqual(data.email);
        expect(response.body.password).not.toEqual(data.password);
        expect(response.body.skills).toEqual(data.skills);
        expect(response.body.profilePicture).toBeTruthy();
        expect(response.body.userType).toEqual("graduate");
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
        expect(user.userType).toEqual("graduate");
        expect(user.isGoogleCreated).toBe(false);

        //Check if there is an x-auth-token
        expect(response.headers["x-auth-token"]).toBeTruthy();
      });
  });
  it("POSTS a user of type ADMIN and checks if the response matches AND the db is consistent", async () => {
    const data = {
      name: "Asma Shakil",
      email: "asma.shakil@auckland.ac.nz",
      password: "test",
      links: [
        {
          type: "github",
          value: "https://github.com/asma-shakil",
        },
      ],
      skills: ["C#", "Cooking Pancakes"],
    };

    await request(app)
      .post("/api/users")
      .send(data)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body.name).toEqual(data.name);
        expect(response.body.email).toEqual(data.email);
        expect(response.body.username).toEqual(data.email);
        expect(response.body.password).not.toEqual(data.password);
        expect(response.body.skills).toEqual(data.skills);
        expect(response.body.profilePicture).toBeTruthy();
        expect(response.body.userType).toEqual("admin");
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
        expect(user.userType).toEqual("admin");
        expect(user.isGoogleCreated).toBe(false);

        //Check if there is an x-auth-token
        expect(response.headers["x-auth-token"]).toBeTruthy();
      });
  });
  it("Succesfully appends a project to a user where a valid projectId is provided", async () => {
    const data = {
      name: "My Next Test User",
      email: "testuser222@aucklanduni.ac.nz",
      password: "test",
      projectId: "6432fe877b09c2f91d48a162",
    };

    await request(app)
      .post("/api/users")
      .send(data)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body.name).toEqual(data.name);
        expect(response.body.email).toEqual(data.email);
        expect(response.body.username).toEqual(data.email);
        expect(response.body.password).not.toEqual(data.password);
        expect(response.body.profilePicture).toBeTruthy();
        expect(response.body.userType).toEqual("graduate");
        expect(response.body.isGoogleCreated).toBe(false);
        expect(response.body.project.toString()).toEqual(data.projectId);

        // Check the data in the database
        const user = await User.findOne({ _id: response.body._id });
        expect(user).toBeTruthy();
        expect(user.name).toEqual(data.name);
        expect(user.email).toEqual(data.email);
        expect(user.username).toEqual(data.email);
        expect(user.password).not.toEqual(data.password);
        expect(user.profilePicture).toBeTruthy();
        expect(user.userType).toEqual("graduate");
        expect(user.isGoogleCreated).toBe(false);
        expect(user.project.toString()).toEqual(data.projectId);

        //Check if there is an x-auth-token
        expect(response.headers["x-auth-token"]).toBeTruthy();
      });
  });
  it("Returns a 400 error if the email already exists in the database", async () => {
    const data = {
      name: "My Second Asma Shakil",
      email: "asma.shakil@auckland.ac.nz",
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
          "Email asma.shakil@auckland.ac.nz already exists!"
        );
      });
  });
  it("Returns a 400 error if a projectId is given which is invalid", async () => {
    const data = {
      name: "testtttt",
      email: "testttttt@aucklanduni.ac.nz",
      password: "test",
      projectId: "6432ze877b09c2f91d18a162",
    };

    await request(app)
      .post("/api/users")
      .send(data)
      .expect(400)
      .then(async (response) => {});
  });
  it("Returns a 400 error if the request.body is invalid", async () => {
    const data = {
      random_attribute: "random",
    };

    await request(app)
      .post("/api/users")
      .send(data)
      .expect(400)
      .then(async (response) => {});
  });
});*/

describe("PATCH Current User", () => {
  it("Sends a 200 response if the user with a valid x-auth-token is succesfully updated", async () => {
    await request(app)
      .patch("/api/users/user/6432fc317b09c2f91d48a0e3")
      .set(
        "x-auth-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDMyZmMzMTdiMDljMmY5MWQ0OGEwZTMiLCJ1c2VybmFtZSI6ImFsZXhxaW5AZ21haWwuY29tIiwidXNlclR5cGUiOiJncmFkdWF0ZSIsImlhdCI6MTY4MzM3NTA1NSwiZXhwIjoxNjg1OTY3MDU1fQ.6-TL3vffkig9vAWt0a8IfQKrUbe2tmEh4VtYOeFsP5A"
      )
      .send({
        name: "Alexis Qin",
      })
      .expect(200)
      .then((response) => {
        expect(response.body.name).toBe("Alexis Qin");
      });

    const user = await User.findOne({ _id: response.body._id });
    expect(user).toBeTruthy();
    expect(user.name).toBe("Alexis Qin");
  });
  it("Sends a 400 response if the x-auth-token is invalid", async () => {
    await request(app)
      .patch("/api/users/user/6432fc317b09c2f91d48a0e3")
      .set("x-auth-token", "No Bueno")
      .expect(400)
      .then((response) => {
        expect(response.body.fail).toBe("Invalid token provided!");
      });
  });
  it("Sends a 401 response if no x-auth-token is provided", async () => {
    await request(app)
      .patch("/api/users/user/6432fc317b09c2f91d48a0e3")
      .expect(401)
      .then((response) => {
        expect(response.body.fail).toBe("Access denied. No token provided.");
      });
  });
});
