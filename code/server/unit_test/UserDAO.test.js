const userDao = require("../modules/UserDAO");

describe("testDao", () => {
  beforeEach(async () => {
    await userDao.deleteUserData();
  });

  afterEach(async () => {
    await userDao.deleteUserData();
  });

  test("delete db", async () => {
    var res = await userDao.getAllUsers();
    expect(res.length).toStrictEqual(0);
  });

  testNewUser("luca", "passw", "admin", "Luca", "Ardito");
  testGetAllUsers();
  testGetUserInfo();
  testGetSuppliersTrue();
  testGetSuppliersFalse();
  testLogin();
  testModifyRights("supplier", "prova@email.com", "customer");
});

function testNewUser(username, passw, role, name, surname) {
  test("create new user", async () => {
    await userDao.newUser(username, passw, role, name, surname);

    var res = await userDao.getAllUsers();
    expect(res.length).toStrictEqual(1);
  });
}

function testGetAllUsers() {
  test("get all users", async () => {
    await userDao.newUser(
      "username@email.it",
      "passw",
      "role",
      "name",
      "surname"
    );
    var res = await userDao.getAllUsers();
    expect(res.length).toStrictEqual(1);
  });
}

function testGetUserInfo() {
  test("get user info", async () => {
    await userDao.newUser(
      "username@email.it",
      "passw",
      "manager",
      "name",
      "surname"
    );
    var res = await userDao.getUserInfo();
    expect(res.length).toStrictEqual(1);
    expect(res[0].username).toEqual("username@email.it");
    expect(res[0].name).toStrictEqual("name");
    expect(res[0].surname).toStrictEqual("surname");
    expect(res[0].role).toStrictEqual("manager");
  });
}

function testGetSuppliersTrue() {
  test("get suppliers 1", async () => {
    await userDao.newUser(
      "username@email.it",
      "passw",
      "supplier",
      "name",
      "surname"
    );
    var res = await userDao.getSuppliers();
    expect(res.length).toStrictEqual(1);
  });
}

function testGetSuppliersFalse() {
  test("get suppliers 2", async () => {
    await userDao.newUser(
      "username@email.it",
      "passw",
      "manager",
      "name",
      "surname"
    );
    var res = await userDao.getSuppliers();
    expect(res.length).toStrictEqual(0);
  });
}

function testLogin() {
  test("login should work", async () => {
    try {
      await userDao.newUser(
        "username@email.it",
        "passw",
        "manager",
        "name",
        "surname"
      );
      var res = await userDao.login("username@email.it", "passw");
      expect(res[0].username).toStrictEqual("username@email.it");
      expect(res[0].name).toStrictEqual("name");
    } catch (e) {
      expect(e).toEqual("Invalid password");
    }
  });
}

function testModifyRights(newType, username, oldType) {
  test("modify user rights", async () => {
    await userDao.newUser(username, "passw", oldType, "name", "surname");

    var res = await userDao.getAllUsers();
    expect(res.length).toStrictEqual(1);
    expect(res[0].username).toStrictEqual(username);
    expect(res[0].name).toStrictEqual("name");
    expect(res[0].surname).toStrictEqual("surname");
    expect(res[0].role).toStrictEqual(oldType);

    //check modRights
    await userDao.modRights(newType, username, oldType);
    res = await userDao.getAllUsers();
    expect(res.length).toStrictEqual(1);
    expect(res[0].username).toStrictEqual(username);
    expect(res[0].name).toStrictEqual("name");
    expect(res[0].surname).toStrictEqual("surname");
    expect(res[0].role).toStrictEqual(newType);
  });
}
