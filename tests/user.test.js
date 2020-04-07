const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

// afterEach(() => {
//   console.log("After each.");
// });

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Pilou BEN FRAJ",
      email: "pilou.ben-fraj@home.fr",
      password: "MyPass777!",
    })
    .expect(201);

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertions about the response
  // expect(response.body.user.name).toBe("Pilou BEN FRAJ");
  expect(response.body).toMatchObject({
    user: {
      name: "Pilou BEN FRAJ",
      email: "pilou.ben-fraj@home.fr",
    },
    token: user.tokens[0].token,
  });
  expect(user.password).not.toBe("MyPass777!");
});

test("Validate new token is saved", async () => {
  const user = await User.findById(userOne._id);
  expect(user.tokens[0]).toMatchObject({
    token: userOne.tokens[0].token,
  });
});

test("Should login existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
});

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "nonexistent@user.com",
      password: "nothingatall",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOne._id);
  expect(user).toBeNull();
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

// Route got removed because sharp module caused the Heroku build to crash
// test("Should upload avatar image", async () => {
// await request(app)
//   .post("/users/me/avatar")
//   .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
//   .attach("avatar", "tests/fixtures/profile-pic.jpg")
//   .expect(200);
// const user = await User.findById(userOne._id);
// expect(user.avatar).toEqual(expect.any(Buffer));
// });

test("Should update valid user fields", async () => {
  await request(app)
    .patch(`/users/me`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Ayoub BEN FRAJ",
    })
    .expect(200);

  const user = await User.findById(userOne._id);
  expect(user.name).toBe("Ayoub BEN FRAJ");
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch(`/users/me`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "Paris",
    })
    .expect(400);
});
