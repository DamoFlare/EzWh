const { hash } = require("bcrypt");

sqlite = require("sqlite3");
bcrypt = require("bcrypt");

/* Init database */
const db = new sqlite.Database("EzWhDB.sqlite", (err) => {
  if (err) throw err;
});

exports.newTableUser = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "CREATE TABLE IF NOT EXISTS USER(ID INTEGER PRIMARY KEY AUTOINCREMENT, USERNAME VARCHAR, PASSWORD VARCHAR, ROLE VARCHAR, NAME VARCHAR, SURNAME VARCHAR)";
    db.run(sql, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

exports.dropTable = () => {
  return new Promise((resolve, reject) => {
    const sql = "DROP TABLE IF EXISTS USER";
    db.run(sql, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

exports.getUserInfo = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT ID, USERNAME, ROLE, NAME, SURNAME FROM USER";
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const user = rows.map((r) => ({
        id: r.ID,
        username: r.USERNAME,
        role: r.ROLE,
        name: r.NAME,
        surname: r.SURNAME,
      }));
      resolve(user);
    });
  });
};

exports.getSuppliers = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM USER WHERE ROLE = 'supplier'";
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const user = rows.map((r) => ({
        ID: r.ID,
        name: r.NAME,
        surname: r.SURNAME,
        email: r.USERNAME,
      }));
      resolve(user);
    });
  });
};

exports.getUsers = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT ID, USERNAME, ROLE, NAME, SURNAME FROM USER WHERE ROLE <> 'manager'";
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      const user = rows.map((r) => ({
        id: r.ID,
        name: r.NAME,
        surname: r.SURNAME,
        role: r.ROLE,
        username: r.USERNAME,
      }));
      resolve(user);
    });
  });
};

exports.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT ID, USERNAME, ROLE, NAME, SURNAME FROM USER";
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject("prova");
      }
      const user = rows.map((r) => ({
        id: r.ID,
        name: r.NAME,
        surname: r.SURNAME,
        role: r.ROLE,
        username: r.USERNAME,
      }));
      resolve(user);
    });
  });
};

exports.newUser = (username, hashedPassword, role, name, surname) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO USER(USERNAME, PASSWORD, ROLE, NAME, SURNAME) VALUES (?, ?, ?, ?, ?)";
    db.get(sql, [username, hashedPassword, role, name, surname], (err) => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};

exports.login = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM USER WHERE USERNAME = ?";
    db.get(sql, [username], async (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      const validPassword = await bcrypt.compare(password, row.PASSWORD);
      if (validPassword) {
        const res = {
          id: row.ID,
          username: row.USERNAME,
          name: row.NAME,
        };
        resolve(res);
      } else {
        reject("Invalid password");
      }
    });
  });
};

exports.modRights = (newType, username, oldType) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE USER SET ROLE = ? WHERE USERNAME = ? AND ROLE = ?";
    db.run(sql, [newType, username, oldType], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

exports.cancel = (username, type) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM USER WHERE USERNAME = ? AND ROLE = ?";
    db.run(sql, [username, type], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

exports.deleteUserData = () => {
  return new Promise((resolve, reject) => {
    const sql1 = "DELETE FROM USER";
    const sql2 = "UPDATE sqlite_sequence SET seq=0 WHERE name='USER'";
    db.serialize(() => {
      db.run(sql1, [], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
      db.run(sql2, [], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  });
};
