const request = require("supertest");
const app = require("../app");

const { Project } = require("../models/project");
const { User } = require("../models/user");
const { Comment } = require("../models/comment");
const admin = require("../middleware/admin");
const cors = require("dotenv").config();

const URLstring = "/api/users/";

const noProject = "No project found";
const invalidToken = "Invalid token provided!";
const noToken = "Access denied. No token provided.";
const notGraduate =
  "Access Denied. You do not have the relevant permissions to access this resource!";
const notYourComment = "Not your comment!";
const invalidSemester = "Invalid semester!";
const invalidCategory = "Invalid category!";
const noUser = "No user found";
const invalidAward = "Invalid award!";
const notAdmin = "Access Denied.";

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
  status: "Active",
};

var testUser = "";
var testUser2 = "";
var testVisitor = "";

var visitorSignIn = {
  username: "testProjectVisitor@gmail.com",
  password: "test",
};

checkPostUserSignIn = {
  username: "thebro@capitalise.space",
  password: "test",
};

var userId = "";
var userId2 = "";
var visitorId = "";
var projectId = "";
var commentId = "";
var commentUser = "";
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
  status: "Active",
};

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
  status: "Active",
};

const checkPostUser = {
  name: "MyPostUser",
  email: "thebro@capitalise.space",
  password: "test",
  links: [
    {
      type: "github",
      value: "https://www.github.com/thebro",
    },
  ],
  status: "Active",
};

const projectData = {
  name: "testProjectForwardSlash",
  semester: "S1 2023",
  category: "Mobile Development",
  tags: ["superCool"],
};

var userSignIn = {
  username: data.email,
  password: data.password,
};

var userSignIn2 = {
  username: data2.email,
  password: data2.password,
};

const adminSignin = {
  username: process.env.USERADMIN,
  password: process.env.USERADMINPASSWORD,
};

const getToken = async (signIn) => {
  const token = await request(app).post("/api/auth").send(signIn);
  return token.text;
};

beforeAll(async () => {
  [visitorId, userId, userId2] = await Promise.all([
    request(app).post("/api/users").send(visitorData),
    request(app).post("/api/users").send(data),
    request(app).post("/api/users").send(data2),
  ]).then((responses) => responses.map((res) => res.body._id));
});

afterAll(async () => {
  await Promise.all([
    User.findByIdAndDelete(visitorId),
    User.findByIdAndDelete(userId),
  ]);
});
/////////////////////////////////////////////////////////////////////////////////////////////

describe("Test that fetches users GET", () => {
  /**********************************
   *           TEST / ROUTE          *
   **********************************/
  it("Sends a 200 response if all projects are fetched using getAllUsers", async () => {
    const response = await request(app).get(URLstring);

    expect(response.statusCode).toEqual(200);
    expect(response.body.length > 0);
  });

  /**********************************
   *     TEST /user/:userID ROUTE      *
   **********************************/

  it("Sends status code 200 if a user's id matches parameter userId using getUserById", async () => {
    const response = await request(app).get(URLstring + `user/${userId}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body._id == userId);
  });

  it("Sends status code 400 if parameter projectId is an invalid mongoDb id", async () => {
    const response = await request(app).get(URLstring + "user/invalidId");

    expect(response.statusCode).toEqual(400);
    expect(response.body.msg == noUser);
  });

  /******************************************
   *     TEST /getCurrentUser/me ROUTE      *
   ******************************************/
  it("Sends status code 200 and returns a user object if user is authenticated succesfully with token", async () => {
    const xToken = await getToken(userSignIn);
    const response = await request(app)
      .get(URLstring + "getCurrentUser/me")
      .set("x-auth-token", xToken);

    dbUser = "";
    //get user from db
    await request(app)
      .get(URLstring + `user/${userId}`)
      .then((res) => {
        dbUser = res.body;
      });
    //expect
    expect(response.statusCode).toEqual(200);
    expect(response.body.name).toEqual(dbUser.name);
  });

  it("Sends a status code 400 if the user cannot be authenticated", async () => {
    const xToken = "fyJhbGciO_PCheHlIMA8";
    const response = await request(app)
      .get(URLstring + "getCurrentUser/me")
      .set("x-auth-token", xToken);

    expect(response.statusCode).toEqual(400);
    expect(response.body.fail).toBe("Invalid token provided!");
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////

describe("Test that creates users POST", () => {
  /**********************************
   *           TEST / ROUTE          *
   **********************************/
  it("Sends a status code 201 and returns a user object when a user is succesfully created", async () => {
    const response = await request(app).post(URLstring).send(checkPostUser);
    //expect
    expect(response.statusCode).toEqual(201);
    //grab from database and make comparisons
    await request(app)
      .get(URLstring + `user/${response.body._id}`)
      .then((res) => {
        expect(res.body.name).toBe(checkPostUser.name);
        expect(res.body.password).not.toBe(checkPostUser.password);
      });
  });
  it("Sends a status code 400 if invalid JSON is passed to the API", async () => {
    const response = await request(app).post(URLstring).send({ yo: "yo" });
    expect(response.statusCode).toEqual(400);
  });
});

describe("Test that modifies user attributes PATCH", () => {
  /***********************************************
   *           TEST /user/:userId ROUTE          *
   ***********************************************/

  it("Sends a status code 200 and returns the newly modified user object when a user is succesfully PATCHed", async () => {
    const xToken = await getToken(userSignIn);
    const response = await request(app)
      .patch(URLstring + `user/${userId}`)
      .send({ name: "Uce Gang" })
      .set("x-auth-token", xToken);
    //expect
    expect(response.statusCode).toEqual(200);
    expect(response.body.name).toBe("Uce Gang");
    //grab from database and make comparisons
    await request(app)
      .get(URLstring + `user/${response.body._id}`)
      .then((res) => {
        expect(res.body.name).toBe("Uce Gang");
      });
  });
  it("Sends a status code 401 if no x-auth-token is provided", async () => {
    const response = await request(app)
      .patch(URLstring + "user/uso")
      .send({ yo: "yo" });
    expect(response.statusCode).toEqual(401);
    expect(response.body.fail).toBe("Access denied. No token provided.");
  });
  it("Sends a status code 401 if an invalid token is provided", async () => {
    const response = await request(app)
      .patch(URLstring + "user/uso")
      .send({ yo: "yo" });
    expect(response.statusCode).toEqual(401);
    expect(response.body.fail).toBe("Access denied. No token provided.");
  });
  it("Sends a status code 403 if a valid token is provided, but the user is NOT an admin AND is trying to modify another user", async () => {
    const xToken = await getToken(userSignIn);
    const response = await request(app)
      .patch(URLstring + `user/${userId2}`)
      .send({ name: "yo" })
      .set("x-auth-token", xToken);

    expect(response.statusCode).toEqual(403);
    expect(response.body.fail).toBe("You are not authorized to edit this user");
  });
});

describe("Test that deletes a user by userId DELETE", () => {
  /*************************************************
   *           DELETE /user/:userId ROUTE          *
   *************************************************/
  it("Sends a status code 200 if a user is succesfully deleted.", async () => {
    const xToken = await getToken(checkPostUserSignIn);
    const myDeletedUser = await User.findOne({ email: checkPostUser.email });
    const response = await request(app)
      .delete(URLstring + `user/${myDeletedUser._id}`)
      .set("x-auth-token", xToken);

    //expect
    expect(response.statusCode).toEqual(200);
    expect(response.body.removed).toBe(`${myDeletedUser.email} removed`);
  });
  it("Checks if the user is associated with a project. If the user has a project, they are removed from that project's member array", async () => {
    //Add user to project
    const adminXToken = getToken(adminSignin);
    await request(app)
      .patch(`/api/projects/addUser/6469fd4325419de4ff3e53b8/${userId2}`)
      .set("x-auth-token", adminXToken);

    //Delete the user
    const xToken = await getToken(userSignIn2);
    const myDeletedUser = await User.findById(userId2);
    const response = await request(app)
      .delete(URLstring + `user/${myDeletedUser._id}`)
      .set("x-auth-token", xToken);

      //console.log(response)

    //Check the user was deleted AND removed from project
    expect(response.statusCode).toEqual(200);
    expect(response.body.removed).toBe(`${myDeletedUser.email} removed`);

    await request(app)
      .get("/api/projects/6469fd4325419de4ff3e53b8")
      .then((res) => {
        expect(res.body.members).toEqual(
          expect.not.arrayContaining([{ _id: userId2 }])
        );
      });
  });
});

/* 

describe('', () =>{

})


it('', async () => {

})
*/
