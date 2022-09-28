var express = require("express");
const sqlite = require("sqlite3");
var router = express.Router();
var TestResultService = require("../services/testresult_service");
const ValidateLogin = require("../modules/ValidateLogin");
const vl = new ValidateLogin();

const dao = require("../modules/TestResultDAO");
const skuitemdao = require("../modules/SkuItemDAO");
const testdescriptordao = require("../modules/TestDescriptorDAO");


const testresult = new TestResultService(dao, skuitemdao, testdescriptordao);


/* Init database */
let db = new sqlite.Database("EzWhDB.sqlite", (err) => {
  if (err) throw err;
});

//GET /api/skuitems/:rfid/testResults
router.get("/:rfid/testResults", async (req, res) => {
  //if (!vl.validateLogin(["manager", "Quality Employee"]))
    //return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await testresult.getTestResultsByRFID(req.params.rfid);
    return res.status(200).json(result).end();
  } catch (error) {
    if(error == 422) return res.status(422).json("validation of rfid failed").end();
    if(error == 404) return res.status(404).json("no sku item associated to rfid").end();
    return res.status(500).json("Generic error").end();
  }
});

//GET/api/skuitems/:rfid/testResults/:id
router.get("/:rfid/testResults/:id", async (req, res) => {
  //if (!vl.validateLogin(["manager", "Quality Employee"]))
    //return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await testresult.getTestResultByRFID_ID(req.params.rfid, req.params.id);
    return res.status(200).json(result).end();
  } catch (error) {
    if(error == 422) return res.status(422).json("validation of id or of rfid failed").end();
    if(error == 404) return res.status(404).json("no test result associated to id or no sku item associated to rfid").end();
    return res.status(500).json("Generic error").end();
  }
});

//POST/api/skuitems/testResult
router.post("/testResult", async (req, res) => {
  //if (!vl.validateLogin(["manager", "Quality Employee"]))
    //return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await testresult.newTableTestResult();
    await testresult.newTestResult(req.body.rfid, req.body.idTestDescriptor, req.body.Date, req.body.Result);
    return res.status(201).json("Success").end();
  } catch (error) {
    if(error == 422) return res.status(422).json("validation of request body or of rfid failed").end();
    if(error == 404) return res.status(404).json("no sku item associated to rfid or no test descriptor associated to idTestDescriptor").end();
    return res.status(500).json("Generic error").end();

  }
});

//PUT /api/skuitems/:rfid/testResult/:id
router.put("/:rfid/testResult/:id", async (req, res) => {
  //if (!vl.validateLogin(["manager", "Quality Employee"]))
    //return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await testresult.editTestResult(req.params.rfid, req.params.id, req.body.newIdTestDescriptor, req.body.newDate, req.body.newResult);
    return res.status(200).json("Success").end();
  } catch (error) {
    if(error == 422) return res.status(422).json("validation of request body, of id or of rfid failed").end();
    if(error == 404) return res.status(404).json("no sku item associated to rfid or no test descriptor associated to newIdTestDescriptor or no test result associated to id").end();
    return res.status(503).json("Generic error").end();
  }
});

//DELETE/api/skuitems/:rfid/testResult/:id
router.delete("/:rfid/testResult/:id", async (req, res) => {
  //if (!vl.validateLogin(["manager", "Quality Employee"]))
    //return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    testresult.deleteTestResult(req.params.rfid, req.params.id);
    return res.status(204).json("Success").end();
  } catch (error) {
    if(error == 422) return res.status(422).json("validation of id or of rfid failed").end();
    return res.status(503).json("Generic error").end();
  }
});

module.exports = router;
