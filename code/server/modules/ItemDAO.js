    sqlite = require('sqlite3');

    /* init database */
    const db = new sqlite.Database("EzWhDB.sqlite", (err) => {
        if (err) throw err;
    });

    exports.newTableItem = () => {
        return new Promise((resolve, reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS ITEM (ITEMID INTEGER PRIMARY KEY, SUPPLIERID INTEGER, DESCRIPTION VARCHAR , PRICE DOUBLE , SKUID INTEGER)";
            db.run(sql,(err) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(true);
            })
        })
    }

    exports.getItems = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM ITEM";
            db.all(sql, (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                const items = rows.map((r) => (
                    {
                        "id":r.ITEMID,
                        "description":r.DESCRIPTION,
                        "price":r.PRICE,
                        "SKUId":r.SKUID,
                        "supplierId":r.SUPPLIERID,
                    }
                ));
                resolve(items);
            })
        })
    }

    exports.newItem = (id, supplierId, description, price, SKUId) => {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO ITEM(ITEMID,SUPPLIERID, DESCRIPTION, PRICE, SKUID) VALUES(?, ?, ?, ?, ?)";
            db.get(sql, [id, supplierId, description, price, SKUId], (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true);
            })
        })
    }

    exports.editItem = (id, supplierId, newDescription, newPrice) => {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE ITEM SET DESCRIPTION = ?, PRICE = ? WHERE ITEMID = ? AND SUPPLIERID = ?";
            db.run(sql, [newDescription, newPrice, id, supplierId], (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true);
            });
        })
    }

    exports.deleteItem = (id, supplierId) => {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM ITEM WHERE ITEMID = ? AND SUPPLIERID = ?";
            db.run(sql, [id, supplierId], (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true);
            })
        })
    }

    exports.dropTable = () => {
        return new Promise((resolve, reject) => {
            const sql = "DROP TABLE IF EXISTS ITEM";
            db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }

    exports.deleteAll = () => {
        return new Promise((resolve, reject) => {
          const sql1 = "DELETE FROM ITEM";
          const sql2 = "UPDATE sqlite_sequence SET seq=0 WHERE name='ITEM'";
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

