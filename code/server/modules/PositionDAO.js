sqlite = require("sqlite3");

/* Init database */
const db = new sqlite.Database("EzWhDB.sqlite", (err) => {
  if (err) throw err;
});

exports.newTablePosition = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "CREATE TABLE IF NOT EXISTS POSITION(ID INTEGER PRIMARY KEY AUTOINCREMENT, POSITIONID VARCHAR, AISLEID VARCHAR, ROW VARCHAR, COLUMN VARCHAR, MAXWEIGHT FLOAT, MAXVOLUME FLOAT, OCC_WEIGHT FLOAT, OCC_VOL FLOAT, SKU_ITEM_ID VARCHAR)";
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
    const sql = "DROP TABLE IF EXISTS POSITION";
    db.run(sql, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

exports.getPositions = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM POSITION";
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const positions = rows.map((r) => ({
        positionID: r.POSITIONID,
        aisleID: r.AISLEID,
        row: r.ROW,
        col: r.COLUMN,
        maxWeight: r.MAXWEIGHT,
        maxVolume: r.MAXVOLUME,
        occupiedWeight: r.OCC_WEIGHT,
        occupiedVolume: r.OCC_VOL,
      }));
      resolve(positions);
    });
  });
};

exports.newPosition = (positionID, aisleID, row, col, maxWeight, maxVolume) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO POSITION(POSITIONID, AISLEID, ROW, COLUMN, MAXWEIGHT, MAXVOLUME, OCC_WEIGHT, OCC_VOL, SKU_ITEM_ID) VALUES (?, ?, ?, ?, ?, ?, 0, 0, 0)";
    db.get(
      sql,
      [positionID, aisleID, row, col, maxWeight, maxVolume],
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

exports.editPositionById = (
  positionID,
  newAisleID,
  newRow,
  newCol,
  newMaxWeight,
  newMaxVolume,
  newOccupiedWeight,
  newOccupiedVolume
) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE POSITION SET AISLEID = ?, ROW = ?, COLUMN = ?, MAXWEIGHT = ?, MAXVOLUME = ?, OCC_WEIGHT = ?, OCC_VOL = ? WHERE POSITIONID = ?";
    db.run(
      sql,
      [
        newAisleID,
        newRow,
        newCol,
        newMaxWeight,
        newMaxVolume,
        newOccupiedWeight,
        newOccupiedVolume,
        positionID,
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
};

exports.changePositionIDByID = (positionID, newPositionID) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE POSITION SET POSITIONID = ? WHERE POSITIONID = ?";
    db.run(sql, [newPositionID, positionID], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

exports.deletePositionByID = (positionID) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM POSITION WHERE POSITIONID = ?";
    db.run(sql, [positionID], (err) => {
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
    db.serialize(() => {
      let sql = "DELETE FROM POSITION";
      db.run(sql, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
      sql = "UPDATE sqlite_sequence SET seq=0 WHERE name='POSITION'";
      db.run(sql, [], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  });
};
