sqlite = require("sqlite3");

/* Init database */
const db = new sqlite.Database("EzWhDB.sqlite", (err) => {
  if (err) throw err;
});

exports.newTableSku = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "CREATE TABLE IF NOT EXISTS SKU(ID INTEGER PRIMARY KEY AUTOINCREMENT, POSITION_ID INTEGER, DESCRIPTION VARCHAR, WEIGHT FLOAT, VOLUME FLOAT, PRICE FLOAT, NOTES VARCHAR, QUANTITY INTEGER, IO_ID INTEGER)";
    db.run(sql, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
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

exports.getSkus = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM SKU LEFT OUTER JOIN SKU_TESTDESCRIPTOR";
    db.all(sql, (err, rows) => {
      if(err){
        reject(err);
        return;
      }
      const result = [];
      rows.forEach((r) => {
        result.push({
          id: r.ID,
          description: r.DESCRIPTION,
          weight: r.WEIGHT,
          volume: r.VOLUME,
          notes: r.NOTES,
          position: r.POSITION_ID,
          availableQuantity: r.QUANTITY,
          price:  r.PRICE,
          testDescriptors: rows.filter((s) => s.SKU_ID == s.ID).map((s) => s.TEST_DESCRIPTOR_ID),
        })
      })
      resolve(result);
    })
  })
}


// exports.getSkus = () => {
//   return new Promise((resolve, reject) => {
//     return new Promise((resolve, reject) => {
//       console.log('SKUDAO - chiamo prima promise')
//       const sql = "SELECT * FROM SKU_TESTDESCRIPTOR";
//       db.all(sql, (err, sku_td) => {
//         if(err){
//           reject(err);
//           return;
//         }
//         console.log('SKUDAO - prima promise - SUCCESS')
//         console.log(sku_td)
//         resolve(sku_td)
//       })
//     }).then((sku_td) => {
//       console.log('SKUDAO - chiamo seconda promise')
//       const sql = "SELECT * FROM SKU";
//       db.all(sql, (err, sku) => {
//         if(err){
//           reject(err);
//           return;
//         }
//         const result = [];
//         sku.forEach((e) => {
//           result.push({
//             id: e.ID,
//             description: e.DESCRIPTION,
//             weight: e.WEIGHT,
//             volume: e.VOLUME,
//             notes: e.NOTES,
//             position: e.POSITION_ID,
//             availableQuantity: e.QUANTITY,
//             price: e.PRICE,
//             testDescriptors: sku_td.filter((s) => s.SKU_ID == e.ID).map((e) => e.TEST_DESCRIPTOR_ID),
//           })
//         })
//         console.log('SKUDAO - seconda promise - SUCCESS')
//         console.log(result)
//         resolve(result);
//       })
//     })
//   })
// }

/*
exports.getSkus = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM SKU LEFT OUTER JOIN SKU_TESTDESCRIPTOR ON SKU.ID=SKU_TESTDESCRIPTOR.SKU_ID";
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      let lastId = -1;
      let testDescriptor = [];
      let result = [];
      for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < rows.length; j++) {
          if (rows[i].ID == rows[j].ID) {
            testDescriptor.push(rows[j].TEST_DESCRIPTOR_ID);
          }
        }
        if (lastId != rows[i].ID || i == rows.lenght - 1) {
          result.push({
            id: rows[i].ID,
            description: rows[i].DESCRIPTION,
            weight: rows[i].WEIGHT,
            volume: rows[i].VOLUME,
            notes: rows[i].NOTES,
            position: rows[i].POSITION_ID,
            availableQuantity: rows[i].QUANTITY,
            price: rows[i].PRICE,
            testDescriptors: testDescriptor,
          });
          lastId = rows[i].ID;
        }
        testDescriptor = [];
      }
      resolve(result);
    });
  });
};
*/

exports.newSku = (
  description,
  weight,
  volume,
  notes,
  price,
  availableQuantity
) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO SKU(DESCRIPTION, WEIGHT, VOLUME, PRICE, NOTES, QUANTITY) VALUES(?, ?, ?, ?, ?, ?)";
    db.run(
      sql,
      [description, weight, volume, price, notes, availableQuantity],
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      }
    );
  });
};

exports.editSku = (
  id,
  newDescription,
  newWeight,
  newVolume,
  newNotes,
  newPrice,
  newAvailableQuantity,
  positionId
) => {
  return new Promise((resolve, reject) => {
    new Promise((resolve, reject) => {
      /* Update SKU table*/
      const sql =
        "UPDATE SKU SET DESCRIPTION = ?, WEIGHT = ?, VOLUME = ?, NOTES = ?, PRICE = ?, QUANTITY = ? WHERE ID = ?";
      db.run(
        sql,
        [
          newDescription,
          newWeight,
          newVolume,
          newNotes,
          newPrice,
          newAvailableQuantity,
          id,
        ],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(true);
        }
      );
    })
      .then(() => {
        /* Update POSITION table */
        const sql =
          "UPDATE POSITION SET OCC_WEIGHT = ?, OCC_VOL = ? WHERE POSITIONID = ?";
        db.run(
          sql,
          [
            newAvailableQuantity * newWeight,
            newAvailableQuantity * newVolume,
            positionId,
          ],
          (err) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(true);
          }
        );
      })
      .catch((err) => reject(err));
  });
};

exports.editSkuPosition = (positionId, id, newWeight, newVol) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      let sql = "UPDATE SKU SET POSITION_ID = ? WHERE ID = ?";
      db.run(sql, [positionId, id], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
      sql =
        "UPDATE POSITION SET OCC_WEIGHT = ?, OCC_VOL = ? WHERE POSITIONID = ?";
      db.run(sql, [newWeight, newVol, positionId], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  });
};

exports.deleteSkuByID = (id, positionId) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      let sql = "DELETE FROM SKU WHERE ID = ?";
      db.run(sql, [id], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
      /* Update position with 0 values */
      sql =
        "UPDATE POSITION SET OCC_WEIGHT = 0.0, OCC_VOL = 0.0 WHERE POSITIONID = ?";
      db.run(sql, [positionId], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    })
  });
};

exports.dropTable = () => {
  return new Promise((resolve, reject) => {
    const sql = "DROP TABLE IF EXISTS SKU";
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
    const sql1 = "DELETE FROM SKU";
    const sql2 = "UPDATE sqlite_sequence SET seq=0 WHERE name='SKU'";
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
