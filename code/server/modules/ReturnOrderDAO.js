    sqlite = require('sqlite3');

    /* Init database */
    let db = new sqlite.Database("EzWhDB.sqlite", (err) => {
        if (err) throw err;
    });
  
    exports.newTableReturnOrder = () => {
        return new Promise((resolve, reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS RETURN_ORDER(ID INTEGER PRIMARY KEY AUTOINCREMENT, DATE TEXT, RESTOCK_ID INTEGER)";
            db.run(sql,(err) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(true);
            })
        })
    }

    exports.newTableProducts = () => {
        return new Promise((resolve, reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS PRODUCT_RO(RO_ID INTEGER, RFID TEXT, SKUID INTEGER, ITEM_ID INTEGER, DESCRIPTION TEXT, PRICE FLOAT, PRIMARY KEY(RO_ID, RFID))";
            db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true);
            })
        })
    }

    exports.getRO = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM RETURN_ORDER INNER JOIN PRODUCT_RO ON PRODUCT_RO.RO_ID = RETURN_ORDER.ID";
            db.all(sql, (err,rows) => {
                if(err){
                    resolve(err);
                    return;
                }
                let lastId = rows[0] != undefined ? rows[0].ID : -1;
                let products = [];
                const result = [];
                for(let i=0; i<rows.length; i++){
                    for(let j=0; j<rows.length; j++){
                        if(rows[i].ID == rows[j].RO_ID){
                            products.push({
                                "SKUId":rows[j].SKUID,
                                "itemId": rows[j].ITEM_ID,
                                "description":rows[j].DESCRIPTION,
                                "price":rows[j].PRICE,
                                "RFID":rows[j].RFID,
                            })
                        }
                    }
                    if(lastId != rows[i].ID || i == rows.length -1){
                        result.push({
                            "id":rows[i].ID,
                            "returnDate":rows[i].DATE,
                            "products":products,
                            "restockOrderId":rows[i].RESTOCK_ID,
                        })
                        lastId = rows[i].ID;
                    }
                    products = [];
                }
                resolve(result);
            })
        })
    }

    exports.newRO = (returnDate, products, restockOrderId) => {
        return new Promise((resolve, reject) => {
            new Promise((resolve, reject) => {
                /* Insert in RETURN_ORDER table*/
                sql = "INSERT INTO RETURN_ORDER(DATE, RESTOCK_ID) VALUES(?, ?)";
                db.run(sql, [returnDate, restockOrderId], function(err){
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);
                })
            }).then((lastID) => {
                /* Insert in PRODUCT table */
                let sql = `INSERT INTO PRODUCT_RO(RO_ID, RFID, SKUID, ITEM_ID, DESCRIPTION, PRICE) VALUES(${lastID}, ?, ?, ?, ?, ?)`;
                db.serialize(() => {
                    products.forEach((e) => {
                        db.run(sql, [e.RFID, e.SKUId, e.itemId, e.description, e.price], (err) => {
                            if(err){
                                reject(err);
                                return;
                            }
                            resolve();
                        })
                    })
                })
            })
            
        })
    }

    exports.deleteRO = (id) => {
        return new Promise((resolve,reject) => {
            new Promise((resolve, reject) => {
                /* Delete from PRODUCT table */
                const sql = "DELETE FROM PRODUCT_RO WHERE RO_ID = ?";
                db.run(sql, [id], (err) => {
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve();
                })
            }).then(() => {
                /* Delete from RETURN_ORDER table */
                const sql = "DELETE FROM RETURN_ORDER WHERE ID = ?";
                db.run(sql, [id], (err) => {
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(true);
                })
            })
        })
    }

    exports.deleteAll = () => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                let sql = "DELETE FROM RETURN_ORDER";
                db.run(sql, (err) => {
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(true);
                })
                sql = "UPDATE sqlite_sequence SET seq=0 WHERE name='RETURN_ORDER'";
                db.run(sql, (err) => {
                  if (err) {
                    reject(err);
                    return;
                  }
                  resolve(true);
                });
                sql = "DELETE FROM PRODUCT_RO";
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

    
