  sqlite = require("sqlite3");
  
  /* Init database */
  let db = new sqlite.Database("EzWhDB.sqlite", (err) => {
    if (err) throw err;
  });

  exports.newTableSkuItem = () => {
    return new Promise((resolve, reject) => {
      const sql =
        "CREATE TABLE IF NOT EXISTS SKUITEM(RFID TEXT PRIMARY KEY, AVAILABLE BOOLEAN, SKU_ID INTEGER, DATE_OF_STOCK TEXT, RESTOCKID INTEGER)";
      db.run(sql, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  }

  exports.dropTable = () => {
    return new Promise((resolve, reject) => {
      const sql = "DROP TABLE IF EXISTS SKUITEM";
      db.run(sql, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  }

  exports.getSkuItems = () => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM SKUITEM";
      db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const skuitems = rows.map((r) => ({
          RFID: r.RFID,
          SKUId: r.SKU_ID,
          Available: r.AVAILABLE,
          DateOfStock: r.DATE_OF_STOCK,
        }));
        console.log(skuitems);
        resolve(skuitems);
      });
    });
  }

  exports.newSkuItem = (RFID, SKUId, DateOfStock) => {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO SKUITEM(RFID, AVAILABLE, SKU_ID, DATE_OF_STOCK, RESTOCKID) VALUES (?, FALSE, ?, ?, 0)";
      db.run(
        sql,
        [RFID, SKUId, DateOfStock],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(true);
        }
      );
    });
  }

  exports.editSkuItem = (RFID, newRFID, newAvailable, newDateOfStock) => {
    return new Promise((resolve, reject) => {
      const sql =
        "UPDATE SKUITEM SET RFID = ?, AVAILABLE = ?, DATE_OF_STOCK = ? WHERE RFID = ?";
      db.run(
        sql,
        [
          newRFID,
          newAvailable,
          newDateOfStock,
          RFID,
        ],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(true);
        }
      );
    });
  }

  exports.deleteSkuItem = (RFID) => {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM SKUITEM WHERE RFID = ?";
      db.run(sql, [RFID], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  }

  exports.deleteAll = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            let sql = "DELETE FROM SKUITEM";
            db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true)
            })
            sql = "UPDATE sqlite_sequence SET seq=0 WHERE name='SKUITEM'"
            db.run(sql, [], function (err) {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(true);
            });
        })
    })
}
