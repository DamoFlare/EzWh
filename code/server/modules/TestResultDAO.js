    sqlite = require('sqlite3');

    /* Init database */
    let db = new sqlite.Database("EzWhDB.sqlite", (err) => {
        if (err) throw err;
    });

    exports.newTableTestResult = () => {
        return new Promise((resolve, reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS TEST_RESULT(RESULTID INTEGER PRIMARY KEY AUTOINCREMENT, DATE DATE, RESULT BOOLEAN, RFID TEXT, DESCRIPTORID INTEGER)";
            db.run(sql,(err) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        })
    }


    exports.getTestResultsByRFID = (rfid) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM TEST_RESULT WHERE RFID = ?";
            db.all(sql, [rfid] ,(err, rows) => {
                if (err){
                    reject(err);
                    return;
                }
                const result = rows.map((r) => (
                    {
                        "id":r.RESULTID,
                        "idTestDescriptor":r.DESCRIPTORID,
                        "Date": r.DATE,
                        "Result": r.RESULT,

                    }
                ));
                resolve(result);
            })
        })
    }
    exports.getSingleTestResultByRFID = (rfid, id) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM TEST_RESULT WHERE RFID = ? AND RESULTID = ?";
            db.all(sql, [rfid, id] ,(err, rows) => {
                if (err){
                    reject(err);
                    return;
                }
                const result = rows.map((r) => (
                    {
                        "id":r.RESULTID ,
                        "idTestDescriptor":r.DESCRIPTORID,
                        "Date": r.DATE,
                        "Result": r.RESULT,

                    }
                ));
                resolve(result);
            })
        })
    }
    

    exports.deleteSingleTestResult = (rfid, id) => {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM TEST_RESULT WHERE RFID = ? AND RESULTID=?";
            db.run(sql, [rfid, id], (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true);
            })
        })
    }

    exports.newTestResult = (rfid, idTestDescriptor, date, result) => {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO TEST_RESULT(DATE, RESULT , RFID , DESCRIPTORID ) VALUES(?, ?, ?, ?)";
            db.get(sql, [date, result, rfid, idTestDescriptor], (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true);
            })
        })
    }


    
    exports.editTestResult = (rfid, id, newIdTestDescriptor, newDate, newResult) => {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE TEST_RESULT SET DESCRIPTORID = ?, DATE=?, RESULT=? WHERE RFID=? AND RESULTID = ?";
            db.run(sql, [newIdTestDescriptor, newDate, newResult, rfid, id], (err) => {
                if(err){
                    reject(err);  
                    return;
                }
                resolve(true); 
            });
        })
    }

    exports.deleteAll = () => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                let sql = "DELETE FROM TEST_RESULT";
                db.run(sql, (err) => {
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(true);
                })
                sql = "UPDATE sqlite_sequence SET seq=0 WHERE name='TEST_RESULT'";
                db.run(sql, (err) => {
                  if(err){
                    reject(err);
                    resolve(true);
                  }
                })
                        
            })
            
        })
    }
    
