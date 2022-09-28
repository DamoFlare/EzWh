const UserService = require("../services/user_service");
const dao = require("../modules/UserDAO");
const user_service = new UserService(dao);

describe("new users", () => {
  beforeEach(async () => {
    await dao.deleteUserData();
  });
  afterEach(async () => {
    await dao.deleteUserData();
  });

  testNewUser("user1@email.it", "passw", "customer", "name", "surname");
  testNewUser("user2@email.it", "passw", "supplier", "name2", "surname2");
  testNewUser("user3@email.it", "passw", "prova", "name2", "surname2");

  async function testNewUser(username, password, role, name, surname) {
    test("new user", async () => {
      try {
        await user_service.newUser(username, password, role, name, surname);

        let res = await user_service.getAllUsers();

        expect(res[0]).toEqual({
          id: 1,
          email: username,
          name: name,
          surname: surname,
          type: role,
        });
      } catch (e) {
        expect(e).toEqual(422);
      }
    });
  }

  /*
describe("set users", () => {
  beforeEach(() => {
    dao.deleteUserData();
  });
  describe("set user data", () => {
    test("setUser", async () => {
      const user = {
        username: "mmz",
        name: "Maurizio",
        surname: "Morisio",
        role: "admin",
      };

      let res = await user_service.setUser(
        user.username,
        user.name,
        user.surname,
        user.role
      );
      res = await user_service.getUser(user.username);

      expect(res).toEqual({
        id: user.username,
        fullName: user.name + " " + user.surname,
        role: user.role,
      });
    });
  });
  */
});

describe("modify rights", () => {
  beforeEach(async () => {
    await dao.deleteUserData();
  });
  afterEach(async () => {
    await dao.deleteUserData();
  });

  testModRights("supplier", "user1@email.it", "customer");
  testModRights("manager", "user1@email.it", "customer");

  async function testModRights(newType, username, oldType) {
    test("modify user rights", async () => {
      try {
        await dao.newUser(username, "passw", oldType, "name", "surname");

        //check modRights
        await user_service.modRights(newType, username, oldType);
        res = await dao.getAllUsers();
        expect(res.length).toStrictEqual(1);
        expect(res[0].username).toStrictEqual(username);
        expect(res[0].name).toStrictEqual("name");
        expect(res[0].surname).toStrictEqual("surname");
        expect(res[0].role).toStrictEqual(newType);
      } catch (e) {
        expect(e).toEqual(422);
      }
    });
  }
});
