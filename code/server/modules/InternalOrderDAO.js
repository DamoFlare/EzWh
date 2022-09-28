sqlite = require("sqlite3");

/* Init database */
const db = new sqlite.Database("EzWhDB.sqlite", (err) => {
  if (err) throw err;
});

exports.newTableInternalOrder = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "CREATE TABLE IF NOT EXISTS INTERNAL_ORDER(ID INTEGER PRIMARY KEY AUTOINCREMENT, ISSUEDATE TEXT , STATE VARCHAR, CUSTOMER_ID INTEGER)";
    db.run(sql, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

exports.newTableProducts = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "CREATE TABLE IF NOT EXISTS PRODUCT_IO(IO_ID INTEGER, SKUID INTEGER, DESCRIPTION TEXT, PRICE FLOAT, QUANTITY INTEGER, PRIMARY KEY(IO_ID, SKUID))";
    db.run(sql, (err) => {
      if (err) {
        console.log("crasha qua?");
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

exports.dropTable = () => {
  return new Promise((resolve, reject) => {
    const sql = "DROP TABLE IF EXISTS INTERNAL_ORDER";
    db.run(sql, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

exports.getInternalOrders = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM INTERNAL_ORDER LEFT OUTER JOIN PRODUCT_IO ON INTERNAL_ORDER.ID = PRODUCT_IO.IO_ID";
    db.all(sql, (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      let lastID = -1;
      let products = [];
      const result = [];
      for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < rows.length; j++) {
          if (rows[i].ID == rows[j].IO_ID) {
            products.push({
              SKUId: rows[j].SKUID,
              description: rows[j].DESCRIPTION,
              price: rows[j].PRICE,
              qty: rows[j].QUANTITY,
            });
          }
        }
        if (lastID != rows[i].ID || i == rows.length) {
          result.push({
            id: rows[i].ID,
            issueDate: rows[i].ISSUEDATE,
            state: rows[i].STATE,
            products: products,
            customerId: rows[i].CUSTOMER_ID,
          });
          lastID = rows[i].ID;
        }
        products = [];
      }
      resolve(result);
    });
  });
};

exports.newInternalOrder = (issueDate, customerId, products) => {
  return new Promise((resolve, reject) => {
    new Promise((resolve, reject) => {
      /* Insert in INTERNAL_ORDER table */
      const sql =
        "INSERT INTO INTERNAL_ORDER(ISSUEDATE, STATE, CUSTOMER_ID) VALUES(?, 'ISSUED', ?)";
      db.run(sql, [issueDate, customerId], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    }).then((ioID) => {
      /* Insert in PRODUCT_IO table */
      const sql = `INSERT INTO PRODUCT_IO(IO_ID, SKUID, DESCRIPTION, PRICE, QUANTITY) VALUES(${ioID}, ?, ?, ?, ?)`;
      db.serialize(() => {
        products.forEach((e) => {
          db.run(sql, [e.SKUId, e.description, e.price, e.qty], (err) => {
            if (err) {
              reject(err);
              return;
            }
            resolve();
          });
        });
      });
    });
  });
};

exports.editInternalOrder = (id, newState, products) => {
  return new Promise((resolve, reject) => {
    let sql = "UPDATE INTERNAL_ORDER SET STATE = ? WHERE ID = ?";
    db.run(sql, [newState, id], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
    if (newState == "COMPLETED") {
      sql = "UPDATE SKUITEM SET AVAILABLE = 0 WHERE RFID = ?";
      db.serialize(() => {
        products.forEach((e) => {
          db.run(sql, [e.RFID], (err) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(true);
          });
        });
      });
    }
  });
};

exports.deleteInternalOrder = (id) => {
  return new Promise((resolve, reject) => {
    let sql = "DELETE FROM INTERNAL_ORDER WHERE ID = ?";
    db.run(sql, [id], (err) => {
      if (err) {
        console.log("crasho prima query");
        reject(err);
        return;
      }
      resolve(true);
    });
    sql = "DELETE FROM PRODUCT_IO WHERE IO_ID = ?";
    db.run(sql, [id], (err) => {
      if (err) {
        console.log("crasho seconda query");
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

exports.deleteAll = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      let sql = "DELETE FROM INTERNAL_ORDER";
      db.run(sql, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
      sql = "UPDATE sqlite_sequence SET seq=0 WHERE name='INTERNAL_ORDER'";
      db.run(sql, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
      sql = "DELETE FROM PRODUCT_IO";
      db.run(sql, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });

      sql = "UPDATE sqlite_sequence SET seq=0 WHERE name='PRODUCT_IO'";
      db.run(sql, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  });
};
