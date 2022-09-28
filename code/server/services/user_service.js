class UserService {
  dao;

  constructor(dao) {
    this.dao = dao;
  }

  getUsers = async () => {
    const users = await this.dao.getUsers();
    let userDTO = users.map((user) => ({
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.username,
      type: user.role,
    }));
    return userDTO;
  };

  getAllUsers = async () => {
    const users = await this.dao.getAllUsers();
    let userDTO = users.map((user) => ({
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.username,
      type: user.role,
    }));
    return userDTO;
  };

  getUserInfo = async () => {
    const users = await this.dao.getUserInfo();
    let userDTO = users.map((user) => ({
      id: user.id,
      username: user.username,
      name: user.name,
      surname: user.surname,
      type: user.role,
    }));
    return userDTO;
  };

  getSuppliers = async () => {
    const users = await this.dao.getSuppliers();
    const userDTO = users.map((user) => ({
      id: user.ID,
      name: user.name,
      surname: user.surname,
      email: user.email,
    }));
    return userDTO;
  };

  newTableUser = async () => {
    const result = await this.dao.newTableUser();
    return result;
  };

  newUser = async (username, hashedPassword, role, name, surname) => {
    const listOfRole = [
      "customer",
      "qualityEmployee",
      "clerk",
      "deliveryEmployee",
      "supplier",
    ];
    if (
      !listOfRole.includes(role) ||
      role == "manager" ||
      role == "administrator"
    ) {
      throw 422;
    }
    const result = await this.dao.newUser(
      username,
      hashedPassword,
      role,
      name,
      surname
    );
    return result;
  };

  login = async (username, password) => {
    const users = await this.dao.getUserInfo();
    if (!users.map((u) => u.username).includes(username))
      throw "Invalid username";
    const result = await this.dao.login(username, password);
    return result;
  };

  modRights = async (newType, username, oldType) => {
    const listOfRole = [
      "customer",
      "qualityEmployee",
      "clerk",
      "deliveryEmployee",
      "supplier",
    ];
    if(oldType === undefined) throw(422);
    const users = await this.dao.getUsers();
    const filtered = users.filter(
      (u) => u.username == username && u.role == oldType
    );
    if (filtered.length == 0) throw 404;
    if (
      filtered.role == "manager" ||
      filtered.role == "administrator" ||
      !listOfRole.includes(newType)
    )
      throw 422;
    const result = this.dao.modRights(newType, username, oldType);
    return result;
  };

  cancel = async (username, role) => {
    const listOfRole = [
      "customer",
      "qualityEmployee",
      "clerk",
      "deliveryEmployee",
      "supplier",
    ];
    if (role == "manager" || role == "administrator" || !listOfRole.includes(role) || !username.includes("@")) throw 422;
    const result = await this.dao.cancel(username, role);
    return result;
  };

  deleteAll = async () => {
    const res = await this.dao.deleteUserData();
    return res;
  };
}

module.exports = UserService;
