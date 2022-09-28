  sqlite = require("sqlite3");

  /* init database */
  const db = new sqlite.Database("EzWhDB.sqlite", (err) => {
    if (err) throw err;
  });

  exports.newTableRestockOrder = () => {
    return new Promise((resolve, reject) => {
      const sql =
        "CREATE TABLE IF NOT EXISTS RESTOCKORDER(RESTOCKID INTEGER PRIMARY KEY AUTOINCREMENT, ISSUEDATE TEXT, STATUS VARCHAR, SUPPLIERID INTEGER)";
      db.run(sql, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  }

  exports.newTableProducts = () => {
    return new Promise((resolve, reject) => {
      const sql =
      "CREATE TABLE IF NOT EXISTS RESTOCKORDER_PRODUCT(RO_ID INTEGER, SKU_ID INTEGER, ITEM_ID INTEGER, DESCRIPTION TEXT, PRICE FLOAT, QUANTITY INTEGER, PRIMARY KEY(RO_ID, SKU_ID))";
      db.run(sql, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  }

  exports.newTableTransportNote = () => {
    return new Promise((resolve, reject) => {
      const sql =
        "CREATE TABLE IF NOT EXISTS TRANSPORTNOTE(TRANSPORTID INTEGER PRIMARY KEY AUTOINCREMENT, DELIVERYDATE TEXT, RESTOCKID INTEGER)";
      db.run(sql, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  }

  exports.newRestockOrder = (issueDate, supplierId, products) => {
    return new Promise((resolve, reject) => {
      new Promise((resolve, reject) => {
        const sql =
          "INSERT INTO RESTOCKORDER(ISSUEDATE, STATUS, SUPPLIERID) VALUES(?, 'ISSUED', ?)";
        db.run(sql, [issueDate, supplierId], function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve(this.lastID);
        });
      }).then((idRO) => {
        const sql = `INSERT INTO RESTOCKORDER_PRODUCT(RO_ID, SKU_ID, ITEM_ID, DESCRIPTION, PRICE, QUANTITY) VALUES(${idRO}, ?, ?, ?, ?, ?)`;
        db.serialize(() => {
          products.forEach((e) => {
            db.run(
              sql,
              [e.SKUId, e.itemId, e.description, e.price, e.qty],
              (err) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(true);
              }
            );
          });
        });
      });
    });
  }

  exports.editState = (id, newState) =>  {
    return new Promise(async (resolve, reject) => {
      const sql = "UPDATE RESTOCKORDER SET STATUS = ? WHERE RESTOCKID = ?";
      db.run(sql, [newState, id], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  }

  exports.getTransportNotesByROid = (id) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM TRANSPORTNOTE WHERE RESTOCKID = ?";
      db.all(sql, [id], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const result = rows.map((r) => ({
          deliveryDate: r.DELIVERYDATE,
        }));
        resolve(result);
      });
    });
  }


  exports.getRestockOrders = () => {
    return new Promise((resolve, reject) => {
      new Promise((resolve, reject) => {
        const box = [];
        const sql = "SELECT * FROM RESTOCKORDER_PRODUCT";
        db.all(sql, (err, ro_product) => {
          if(err){
            reject(err);
            return;
          }
          box.push(ro_product)
          resolve(box)
        })
      }).then((box) => {
        new Promise((resolve, reject) => {
          const sql = "SELECT * FROM SKUITEM LEFT OUTER JOIN ITEM ON SKUITEM.SKU_ID = ITEM.SKUID";
          db.all(sql, (err, skuitems) => {
            if(err){
              reject(err);
              return;
            }
            box.push(skuitems);
            resolve(box);
          })
        }).then((box) => {
          new Promise((resolve, reject) => {
            const sql = "SELECT * FROM TRANSPORTNOTE";
            db.all(sql, (err, transportNote) => {
              if (err) {
                reject(err);
                return;
              }
              box.push(transportNote)
              resolve(box);
            });
          }).then((box) => {
            const sql = "SELECT * FROM RESTOCKORDER";
            db.all(sql, (err, restockOrder) => {
              if(err){
                reject(err);
                return;
              }
              box.push(restockOrder);
              const result = [];
              box[3].forEach((e) => {
                result.push({
                  id: e.RESTOCKID,
                  issueDate: e.ISSUEDATE,
                  state: e.STATUS,
                  products: box[0]
                    .filter((p) => p.RO_ID == e.RESTOCKID)
                    .map((e) => ({
                      SKUId: e.SKU_ID,
                      itemId: e.ITEM_ID,
                      description: e.DESCRIPTION,
                      price: e.PRICE,
                      qty: e.QUANTITY,
                    })),
                  supplierId: e.SUPPLIERID,
                  transportNote: box[2]
                    .filter((p) => p.RESTOCKID == e.RESTOCKID)
                    .map((e) => ({
                      deliveryDate: e.DELIVERYDATE,
                    })),
                  skuItems: box[1]
                    .filter((s) => s.RESTOCKID == e.RESTOCKID)
                    .map((e) => ({
                      SKUId: e.SKU_ID,
                      rfid: e.RFID,
                      itemId: e.ITEMID,
                    })),
                });
              })
              resolve(result);
            })
          })
        })
      })
    })
  }

  /*
  exports.getRestockOrders = () => {
    return new Promise(async (resolve, reject) => {
      const products = await new Promise((resolve, reject) => {
        const sql = "SELECT * FROM RESTOCKORDER_PRODUCT";
        db.all(sql, (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows);
        });
      });
      const skuitems = await new Promise((resolve, reject) => {
        const sql = "SELECT * FROM SKUITEM";
        db.all(sql, (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows);
        });
      });
      const transportnotes = await new Promise((resolve, reject) => {
        const sql = "SELECT * FROM TRANSPORTNOTE";
        db.all(sql, (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows);
        });
      });
      const sql = "SELECT * FROM RESTOCKORDER";
      db.all(sql, (err, restockorders) => {
        if (err) {
          reject(err);
          return;
        }
        const result = [];
        restockorders.forEach((e) => {
          result.push({
            id: e.RESTOCKID,
            issueDate: e.ISSUEDATE,
            state: e.STATUS,
            products: products
              .filter((p) => p.RO_ID == e.RESTOCKID)
              .map((e) => ({
                SKUId: e.SKU_ID,
                description: e.DESCRIPTION,
                price: e.PRICE,
                qty: e.QUANTITY,
              })),
            supplierId: e.SUPPLIERID,
            transportNote: transportnotes
              .filter((p) => p.RESTOCKID == e.RESTOCKID)
              .map((e) => ({
                deliveryDate: e.DELIVERYDATE,
              })),
            skuItems: skuitems
              .filter((s) => s.RESTOCKID == e.RESTOCKID)
              .map((e) => ({
                SKUId: e.SKUID,
                rfid: e.RFID,
              })),
          });
          resolve(result);
        });
      });
    });
  }
  */

  exports.addSkuItemsToRO = (id, skuItems) => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE SKUITEM SET RESTOCKID = ? WHERE RFID = ?";
      db.serialize(() => {
        skuItems.forEach((s) => {
          db.run(sql, [id, s.rfid], (err) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(true);
          });
        });
      });
    });
  }

  exports.addTransportNote = (id, transportNote) => {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO TRANSPORTNOTE(DELIVERYDATE, RESTOCKID) VALUES(?,?)";
      db.run(
        sql,
        [transportNote.deliveryDate, id],
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

  
  exports.deleteRestockOrder = (id) => {
    return new Promise((resolve, reject) => {
      const queries = ["DELETE FROM RESTOCKORDER WHERE RESTOCKID = ?","DELETE FROM RESTOCKORDER_PRODUCT WHERE RO_ID = ?","DELETE FROM TRANSPORTNOTE WHERE RESTOCKID = ?"];
      db.serialize(() => {
        queries.forEach((q) => {
          db.run(q, [id], (err) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(true);
          });
        })
      })
      
    });
  }
  

  exports.getSkuItemsByIdRO = (id) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM SKUITEM WHERE RESTOCK_ID = ?";
      db.all(sql, [id], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const result = rows.map((e) => ({
          SKUId: e.SKUID,
          rfid: e.RFID,
        }));
        resolve(result);
      });
    });
  }

  exports.getFailedSkuItemsByIdRO = (id) =>  {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT * FROM SKUITEM INNER JOIN TEST_RESULT ON SKUITEM.RFID = TEST_RESULT.RFID INNER JOIN RESTOCKORDER_PRODUCT ON SKUITEM.SKU_ID = SKUITEM.SKU_ID WHERE RESULT=FALSE AND RESTOCKID = ?";
      db.all(sql, [id], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const result = rows.map((e) => ({
          SKUId: e.SKU_ID,
          rfid: e.RFID,
          itemId: e.ITEM_ID,
        }));
        resolve(result);
      });
    });
  }

  exports.dropTable = (db) => {
    return new Promise((resolve, reject) => {
      const sql = "DROP TABLE IF EXISTS RESTOCKORDER";
      db.run(sql, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  }
  
  
  exports.deleteAll = () => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        let sql = "DELETE FROM RESTOCKORDER";
        db.run(sql, (err) => {
          if(err){
            reject(err);
            return;
          }
          resolve(true);
        })
        sql = "UPDATE sqlite_sequence SET seq=0 WHERE name='RESTOCKORDER'";
        db.run(sql, (err) => {
          if(err){
            reject(err);
            resolve(true);
          }
        })
        sql = "DELETE FROM RESTOCKORDER_PRODUCT";
        db.run(sql, (err) => {
          if(err){
            reject(err);
            return;
          }
          resolve(true)
        })
        sql = "DELETE FROM TRANSPORTNOTE";
        db.run(sql, (err) => {
          if(err){
            reject(err);
            return;
          }
          resolve(true);
        })
        sql = "UPDATE sqlite_sequence SET seq=0 WHERE name='TRANSPORTNOTE'";
        db.run(sql, (err) => {
          if(err){
            reject(err);
            return;
          }
          resolve(true);
        })
      })
    })
    
  }
