const app = require("../app");
const request = require("supertest");
const { User, validate } = require("../models/user");
const { Project } = require("../models/project");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

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
  it("Sends a 400 response if the userID is valid but no user exists with userID", async () => {
    await request(app)
      .get("/api/users/user/6432f8826cce2fc1706572d4")
      .expect(400)
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
        process.env.VISITORTOKEN
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
        const user1 = await User.findOne({ _id: response.body._id });
        expect(user1).toBeTruthy();
        expect(user1.name).toEqual(data.name);
        expect(user1.email).toEqual(data.email);
        expect(user1.username).toEqual(data.email);
        expect(user1.password).not.toEqual(data.password);
        expect(user1.skills).toEqual(data.skills);
        expect(user1.profilePicture).toBeTruthy();
        expect(user1.userType).toEqual("visitor");
        expect(user1.isGoogleCreated).toBe(false);

        //Check if there is an x-auth-token
        expect(response.headers["x-auth-token"]).toBeTruthy();
        user1xtoken = response.headers["x-auth-token"];
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
        const user2 = await User.findOne({ _id: response.body._id });
        expect(user2).toBeTruthy();
        expect(user2.name).toEqual(data.name);
        expect(user2.email).toEqual(data.email);
        expect(user2.username).toEqual(data.email);
        expect(user2.password).not.toEqual(data.password);
        expect(user2.skills).toEqual(data.skills);
        expect(user2.profilePicture).toBeTruthy();
        expect(user2.userType).toEqual("graduate");
        expect(user2.isGoogleCreated).toBe(false);

        //Check if there is an x-auth-token
        expect(response.headers["x-auth-token"]).toBeTruthy();
        user2xtoken = response.headers["x-auth-token"];
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
        const user3 = await User.findOne({ _id: response.body._id });
        expect(user3).toBeTruthy();
        expect(user3.name).toEqual(data.name);
        expect(user3.email).toEqual(data.email);
        expect(user3.username).toEqual(data.email);
        expect(user3.password).not.toEqual(data.password);
        expect(user3.skills).toEqual(data.skills);
        expect(user3.profilePicture).toBeTruthy();
        expect(user3.userType).toEqual("admin");
        expect(user3.isGoogleCreated).toBe(false);

        //Check if there is an x-auth-token
        expect(response.headers["x-auth-token"]).toBeTruthy();
        user3xtoken = response.headers["x-auth-token"];
      });
  });
  it("Succesfully appends a project to a user where a valid projectId is provided", async () => {
    const data = {
      name: "My Next Test User",
      email: "testuser222@aucklanduni.ac.nz",
      password: "test",
      projectId: "645b8a5ce8dc8357cec2e7a4",
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
        user4xtoken = response.headers["x-auth-token"];
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
});

describe("PATCH Current User", () => {
  it("Sends a 200 response if the user with a valid x-auth-token is succesfully updated", async () => {
    const OriginalUser = await User.findOne({
      _id: "6432fc317b09c2f91d48a0e3",
    });
    await request(app)
      .patch("/api/users/user/6432fc317b09c2f91d48a0e3")
      .set(
        "x-auth-token",
        process.env.ALEXTOKEN
      )
      .send({
        name: "Alexis Qin",
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.name).toBe("Alexis Qin");
        const user = await User.findOne({ _id: response.body._id });
        expect(user).toBeTruthy();
        expect(user.name).toBe("Alexis Qin");
        expect(user.name).not.toBe(OriginalUser.name);
      });

    // RESET IT BACK TO ALEX QIN
    await User.findOne({
      _id: "6432fc317b09c2f91d48a0e3",
    });
    await request(app)
      .patch("/api/users/user/6432fc317b09c2f91d48a0e3")
      .set(
        "x-auth-token",
        process.env.ALEXTOKEN
      )
      .send({
        name: "Alex Qin",
      });
  });
  it("Sends a 200 response if an admin updates a different user", async () => {
    const OriginalUser = await User.findOne({
      _id: "6432fc317b09c2f91d48a0e3",
    });
    await request(app)
      .patch("/api/users/user/6432fc317b09c2f91d48a0e3")
      .set(
        "x-auth-token",
        process.env.ALEXTOKEN
      )
      .send({
        name: "Alexis Qin",
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.name).toBe("Alexis Qin");
        const user = await User.findOne({ _id: response.body._id });
        expect(user).toBeTruthy();
        expect(user.name).toBe("Alexis Qin");
        expect(user.name).not.toBe(OriginalUser.name);
      });

    // RESET IT BACK TO ALEX QIN
    await User.findOne({
      _id: "6432fc317b09c2f91d48a0e3",
    });
    await request(app)
      .patch("/api/users/user/6432fc317b09c2f91d48a0e3")
      .set(
        "x-auth-token",
        process.env.ALEXTOKEN
      )
      .send({
        name: "Alex Qin",
      });
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
  it("Sends a 400 response if no user is found", async () => {
    await request(app)
      .patch("/api/users/user/6432fc317b09c2f89d48a1f3")
      .set(
        "x-auth-token",
        process.env.ANDREWTOKEN
      )
      .expect(400)
      .then((response) => {
        expect(response.body.fail).toBe("User not found");
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
  it("Sends a 403 response if a non-admin user attempts to modify a different user's information", async () => {
    await request(app)
      .patch("/api/users/user/6432f8826cce2fc1706572d3")
      .set(
        "x-auth-token",
        process.env.RACHELTOKEN
      )
      .expect(403)
      .then((response) => {
        expect(response.body.fail).toBe("You are not authorized to edit this user");
      });
  });
  it("Disregards if a visitor or graduate adds a userType attribute, but updates all other provided attributes.", async () => {
    await request(app)
      .patch("/api/users/user/6432fc317b09c2f91d48a0e3")
      .set(
        "x-auth-token",
        process.env.ALEXTOKEN
      )
      .send({
        name: "Alexis Qin",
        userType: "admin",
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.name).toBe("Alexis Qin");
        expect(response.body.userType).toBe("graduate");
        const user = await User.findOne({ _id: response.body._id });
        expect(user).toBeTruthy();
        expect(user.name).toBe("Alexis Qin");
        expect(user.userType).toBe("graduate");
      });

    // RESET IT BACK TO ALEX QIN
    await User.findOne({
      _id: "6432fc317b09c2f91d48a0e3",
    });
    await request(app)
      .patch("/api/users/user/6432fc317b09c2f91d48a0e3")
      .set(
        "x-auth-token",
        process.env.ALEXTOKEN
      )
      .send({
        name: "Alex Qin",
      });
  });
  it("Updates the username field if the email address of a valid PATCH request is updated", async () => {
    await request(app)
      .patch("/api/users/user/6432fc317b09c2f91d48a0e3")
      .set(
        "x-auth-token",
        process.env.ALEXTOKEN
      )
      .send({
        email: "alex.qin@aucklanduni.ac.nz",
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.email).toBe("alex.qin@aucklanduni.ac.nz");
        expect(response.body.username).toBe("alex.qin@aucklanduni.ac.nz");
        const user = await User.findOne({ _id: response.body._id });
        expect(user).toBeTruthy();
        expect(user.email).toBe("alex.qin@aucklanduni.ac.nz");
        expect(user.username).toBe("alex.qin@aucklanduni.ac.nz");
      });

    // RESET THE EMAIL BACK TO ALEXQIN@GMAIL.COM
    await User.findOne({
      _id: "6432fc317b09c2f91d48a0e3",
    });
    await request(app)
      .patch("/api/users/user/6432fc317b09c2f91d48a0e3")
      .set(
        "x-auth-token",
        process.env.ALEXTOKEN
      )
      .send({
        email: "alexqin@gmail.com",
      });
  });
});

describe("DELETE a User", () => {
  it("Sends a 200 response if all three users created in the POST tests are deleted (Individual auth tokens are provided). This also tests admin DELETE.", async () => {
    //DELETE testuser12@gmail.com
    user1 = await User.findOne({ email: "testuser12@gmail.com" });
    await request(app)
      .delete(`/api/users/user/${user1._id}`)
      .set("x-auth-token", user1xtoken)
      .expect(200)
      .then((response) => {
        expect(response.body.removed).toBe("testuser12@gmail.com removed");
      });

    //DELETE testuser12@aucklanduni.ac.nz
    user2 = await User.findOne({ email: "testuser12@aucklanduni.ac.nz" });
    await request(app)
      .delete(`/api/users/user/${user2._id}`)
      .set("x-auth-token", user2xtoken)
      .expect(200)
      .then((response) => {
        expect(response.body.removed).toBe(
          "testuser12@aucklanduni.ac.nz removed"
        );
      });

    //DELETE asma.shakil@auckland.ac.nz
    user3 = await User.findOne({ email: "asma.shakil@auckland.ac.nz" });
    await request(app)
      .delete(`/api/users/user/${user3._id}`)
      .set("x-auth-token", user3xtoken)
      .expect(200)
      .then((response) => {
        expect(response.body.removed).toBe(
          "asma.shakil@auckland.ac.nz removed"
        );
      });

    // DELETE testuser222@aucklanduni.ac.nz
    user4 = await User.findOne({ email: "testuser222@aucklanduni.ac.nz" });
    await request(app)
      .delete(`/api/users/user/${user4._id}`)
      .set("x-auth-token", user4xtoken)
      .expect(200)
      .then(async (response) => {
        expect(response.body.removed).toBe(
          "testuser222@aucklanduni.ac.nz removed"
        );
        // Check if the user was removed from the project with ID 6432fe877b09c2f91d48a162
        const project = await Project.findOne({
          _id: "645b8a5ce8dc8357cec2e7a4",
        });
        expect(project.members).toEqual(
          expect.not.arrayContaining([{ _id: user4._id }])
        );
      });
  });
  it("Sends a 400 response if the x-auth-token is invalid", async () => {
    await request(app)
      .delete(`/api/users/user/${user1._id}`)
      .set("x-auth-token", "No Bueno")
      .expect(400)
      .then((response) => {
        expect(response.body.fail).toBe("Invalid token provided!");
      });
  });
  it("Sends a 401 response if no x-auth-token is provided", async () => {
    await request(app)
      .delete(`/api/users/user/${user1._id}`)
      .expect(401)
      .then((response) => {
        expect(response.body.fail).toBe("Access denied. No token provided.");
      });
  });
  it("Sends a 403 response if a non-admin user attempts to delete another user", async () => {
    await request(app)
      .delete("/api/users/user/6432f8826cce2fc1706572d3")
      .set(
        "x-auth-token",
        process.env.RACHELTOKEN
      )
      .expect(403)
      .then((response) => {
        expect(response.body.fail).toBe(
          "You are not authorized to delete this user"
        );
      });
  });
});
