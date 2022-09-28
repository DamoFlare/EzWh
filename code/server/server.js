var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var sqlite = require("sqlite3");
var bcrypt = require("bcrypt");


var usersRouter = require("./routes/users");
var internalOrderRouter = require("./routes/internalorder");
var skuRouter = require("./routes/sku");
var skuItemRouter = require("./routes/skuitem");
var positionRouter = require("./routes/position");
var testDescriptorRouter = require("./routes/testdescriptor");
var testResultRouter = require("./routes/testresult");
var returnOrderRouter = require("./routes/returnorder");
var itemRouter = require("./routes/item");
var restockOrderRouter = require("./routes/restockorder");

var app = express();

/* Init database */
const db = new sqlite.Database("EzWhDB.sqlite", (err) => {
  if (err) throw err;
});

const createTables = new Promise((resolve, reject) => {
  const listOfQueries = [
    "CREATE TABLE IF NOT EXISTS INTERNAL_ORDER(ID INTEGER PRIMARY KEY AUTOINCREMENT, ISSUEDATE TEXT , STATE VARCHAR, CUSTOMER_ID INTEGER)",
    "CREATE TABLE IF NOT EXISTS PRODUCT_IO(IO_ID INTEGER, SKUID INTEGER, DESCRIPTION TEXT, PRICE FLOAT, QUANTITY INTEGER, PRIMARY KEY(IO_ID, SKUID))",
    "CREATE TABLE IF NOT EXISTS ITEM (ITEMID INTEGER PRIMARY KEY, SUPPLIERID INTEGER, DESCRIPTION VARCHAR , PRICE DOUBLE , SKUID INTEGER)",
    "CREATE TABLE IF NOT EXISTS POSITION(ID INTEGER PRIMARY KEY AUTOINCREMENT, POSITIONID INTEGER, AISLEID INTEGER, ROW INTEGER, COLUMN INTEGER, MAXWEIGHT FLOAT, MAXVOLUME FLOAT, OCC_WEIGHT FLOAT, OCC_VOL FLOAT, SKU_ITEM_ID VARCHAR)",
    "CREATE TABLE IF NOT EXISTS RESTOCKORDER(RESTOCKID INTEGER PRIMARY KEY AUTOINCREMENT, ISSUEDATE TEXT, STATUS VARCHAR, SUPPLIERID INTEGER)",
    "CREATE TABLE IF NOT EXISTS RESTOCKORDER_PRODUCT(RO_ID INTEGER, SKU_ID INTEGER, ITEM_ID INTEGER, DESCRIPTION TEXT, PRICE FLOAT, QUANTITY INTEGER, PRIMARY KEY(RO_ID, SKU_ID))",
    "CREATE TABLE IF NOT EXISTS TRANSPORTNOTE(TRANSPORTID INTEGER PRIMARY KEY AUTOINCREMENT, DELIVERYDATE TEXT, RESTOCKID INTEGER)",
    "CREATE TABLE IF NOT EXISTS RETURN_ORDER(ID INTEGER PRIMARY KEY AUTOINCREMENT, DATE TEXT, RESTOCK_ID INTEGER)",
    "CREATE TABLE IF NOT EXISTS PRODUCT_RO(RO_ID INTEGER, RFID TEXT, SKUID INTEGER, ITEM_ID INTEGER, DESCRIPTION TEXT, PRICE FLOAT, PRIMARY KEY(RO_ID, RFID))",
    "CREATE TABLE IF NOT EXISTS SKU(ID INTEGER PRIMARY KEY AUTOINCREMENT, POSITION_ID INTEGER, DESCRIPTION VARCHAR, WEIGHT FLOAT, VOLUME FLOAT, PRICE FLOAT, NOTES VARCHAR, QUANTITY INTEGER, IO_ID INTEGER)",
    "CREATE TABLE IF NOT EXISTS SKU_TESTDESCRIPTOR(SKU_ID INTEGER, TEST_DESCRIPTOR_ID INTEGER, PRIMARY KEY(SKU_ID, TEST_DESCRIPTOR_ID))",
    "CREATE TABLE IF NOT EXISTS SKUITEM(RFID TEXT PRIMARY KEY, AVAILABLE BOOLEAN, SKU_ID INTEGER, DATE_OF_STOCK TEXT, RESTOCKID INTEGER)",
    "CREATE TABLE IF NOT EXISTS TEST_DESCRIPTOR(ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME VARCHAR, DESCRIPTION VARCHAR, SKU_ID INTEGER)",
    "CREATE TABLE IF NOT EXISTS SKU_TESTDESCRIPTOR(SKU_ID INTEGER, TEST_DESCRIPTOR_ID INTEGER, PRIMARY KEY(SKU_ID, TEST_DESCRIPTOR_ID))",
    "CREATE TABLE IF NOT EXISTS TEST_RESULT(RESULTID INTEGER PRIMARY KEY AUTOINCREMENT, DATE DATE, RESULT BOOLEAN, RFID TEXT, DESCRIPTORID INTEGER)",
    "CREATE TABLE IF NOT EXISTS USER(ID INTEGER PRIMARY KEY AUTOINCREMENT, USERNAME VARCHAR, PASSWORD VARCHAR, ROLE VARCHAR, NAME VARCHAR, SURNAME VARCHAR)",
  ]
  db.serialize(() => {
    listOfQueries.forEach((query) => {
      db.run(query, (err) => {
        if(err){
          reject(err);
          return;
        }
        resolve(true);
      })
    })
  })

})

const insertUsers = new Promise(async(resolve, reject) => {
  const password = await bcrypt.hash("testpassword", 10);
  const listOfUsers = [{username: "user1@ezwh.com", password: password, role: "customer"},
  {username: "qualityEmployee1@ezwh.com", password: password, role: "qualityEmployee"},
  {username: "clerk1@ezwh.com", password: password, role: "clerk"},
  {username: "deliveryEmployee1@ezwh.com", password: password, role: "deliveryEmployee"},
  {username: "supplier1@ezwh.com", password: password, role: "supplier"},
  {username: "manager1@ezwh.com", password: password, role: "manager"}
]
  db.serialize(() => {
    listOfUsers.forEach((user) => {
      db.run("INSERT INTO USER(USERNAME, PASSWORD, ROLE) VALUES(?, ?, ?)", [user.username, user.password, user.role], (err) => {
        if(err){
          reject(err);
          return;
        }
        resolve(err);
      })
    })
  })
})

const deleteAll = new Promise((resolve, reject) => {
  const listOfTables=['INTERNAL_ORDER','ITEM','POSITION','PRODUCT_IO','PRODUCT_RO','RESTOCKORDER','RESTOCKORDER_PRODUCT','RETURN_ORDER','SKU','SKUITEM','SKU_TESTDESCRIPTOR','TEST_DESCRIPTOR','TEST_RESULT','TRANSPORTNOTE','USER', 'sqlite_sequence'];
  db.serialize(() => {
    listOfTables.forEach((table) => {
      db.run(`DELETE FROM ${table}`, (err) => {
        if(err){
          reject(err);
          return;
        }
        resolve(true);
      })
    })
  })
})


Promise.all([deleteAll, createTables, insertUsers]);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", usersRouter);
app.use("/api", internalOrderRouter);
app.use("/api", skuRouter);
app.use("/api", skuItemRouter);
app.use("/api", positionRouter);
app.use("/api", testDescriptorRouter);
app.use("/api/skuitems", testResultRouter);
app.use("/api", returnOrderRouter);
app.use("/api", itemRouter);
app.use("/api", restockOrderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
