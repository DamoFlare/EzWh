sqlite = require("sqlite3");

/* Init database */
let db = new sqlite.Database("EzWhDB.sqlite", (err) => {
  if (err) throw err;
});

exports.newTableTestDescriptor = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "CREATE TABLE IF NOT EXISTS TEST_DESCRIPTOR(ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME VARCHAR, DESCRIPTION VARCHAR, SKU_ID INTEGER)";
    db.run(sql, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

exports.getTestDescriptors = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM TEST_DESCRIPTOR";
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const testDescriptors = rows.map((r) => ({
        id: r.ID,
        name: r.NAME,
        procedureDescription: r.DESCRIPTION,
        idSKU: r.SKU_ID,
      }));
      resolve(testDescriptors);
    });
  });
};

exports.newTestDescriptor = (name, procedureDescription, idSKU) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO TEST_DESCRIPTOR(NAME, DESCRIPTION, SKU_ID) VALUES(?, ?, ?)";
    db.run(sql, [name, procedureDescription, idSKU], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  }).then((lastID) => {
    const sql =
      "INSERT INTO SKU_TESTDESCRIPTOR(SKU_ID, TEST_DESCRIPTOR_ID) VALUES(?,?)";
    db.run(sql, [idSKU, lastID], (err) => {
      if (err) {
        throw err;
      }
      return true;
    });
  });
};

exports.newTableSkuTestDescriptors = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "CREATE TABLE IF NOT EXISTS SKU_TESTDESCRIPTOR(SKU_ID INTEGER, TEST_DESCRIPTOR_ID INTEGER, PRIMARY KEY(SKU_ID, TEST_DESCRIPTOR_ID))";
    db.run(sql, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

exports.editTestDescriptor = (
  newName,
  newProcedureDescription,
  newIdSKU,
  id
) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE TEST_DESCRIPTOR SET NAME = ?, DESCRIPTION = ?, SKU_ID = ? WHERE ID = ?";
    db.run(sql, [newName, newProcedureDescription, newIdSKU, id], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

exports.deleteTestDescriptor = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM TEST_DESCRIPTOR WHERE ID = ? ";
    db.run(sql, [id], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

exports.deleteAll = () => {
  return new Promise((resolve, reject) => {
    const sql1 = "DELETE FROM TEST_DESCRIPTOR";
    const sql2 =
      "UPDATE sqlite_sequence SET seq=0 WHERE name='TEST_DESCRIPTOR'";
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

exports.dropTable = () => {
  return new Promise((resolve, reject) => {
    const sql = "DROP TABLE IF EXISTS TEST_DESCRIPTOR";
    db.run(sql, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

exports.deleteAll = () => {
  return new Promise((resolve, reject) => {
    const sql1 = "DELETE FROM TEST_DESCRIPTOR";
    const sql2 =
      "UPDATE sqlite_sequence SET seq=0 WHERE name='TEST_DESCRIPTOR'";
    const sql3 = "DELETE FROM SKU_TESTDESCRIPTOR";
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
      db.run(sql3, [], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  });
};
