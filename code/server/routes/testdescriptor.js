var express = require("express");
const sqlite = require("sqlite3");
var router = express.Router();
var TestDescriptorService = require("../services/testdescriptor_service");
const ValidateLogin = require("../modules/ValidateLogin");
const vl = new ValidateLogin();

const dao = require("../modules/TestDescriptorDAO");
const skudao = require("../modules/SkuDAO");

const testDescriptor = new TestDescriptorService(dao, skudao);


//GET /testDescriptors
router.get("/testDescriptors", async (req, res) => {
  //if (!vl.validateLogin([["manager"], "Quality Employee"]))
    //return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await testDescriptor.getTestDescriptors();
    return res.status(200).json(result).end();
  } catch (error) {
    return res.status(500).json("Generic Error").end();
  }
});

//GET /testDescriptors/:id
router.get("/testDescriptors/:id", async (req, res) => {
  //if (!vl.validateLogin(["manager"]))
    //return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await testDescriptor.getTestDescriptorByID(req.params.id);
    return res.status(200).json(result).end();
  } catch (error) {
    if (error == 404) return res.status(404).json("No test descriptor associated id").end();
    if (error == 422) return res.status(422).json("Validation of id failed").end();
    return res.status(500).json("Generic error").end();
  }
});

//POST /testDescriptor
router.post("/testDescriptor", async (req, res) => {
  //if (!vl.validateLogin([["manager"]]))
    //return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await testDescriptor.newTableTestDescriptor();
    await testDescriptor.newTableSkuTestDescriptors();
    await testDescriptor.newTestDescriptor(req.body.name, req.body.procedureDescription, req.body.idSKU);
    return res.status(201).json("Success").end();
  } catch (error) {
    if (error == 404) return res.status(404).json("No SKU associated idSKU").end();
    if(error == 422) return res.status(422).json("Validation of id failed").end();
    return res.status(503).json(error).end();
  }
});

//PUT /testDescriptor/:id
router.put("/testDescriptor/:id", async (req, res) => {
  //if (!vl.validateLogin([["manager"]]))
    //return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await testDescriptor.editTestDescriptor(req.body.newName, req.body.newProcedureDescription, req.body.newIdSKU, req.params.id);
    return res.status(200).json("Success").end();
  } catch (error) {
    if(error == 404) return res.status(404).json("No test descriptor associated id or no sku associated to IDSku").end();
    if(error == 422) return res.status(422).json("Validation of request body or of id failed").end();
    return res.status(503).json("Generic error").end();
  }
});

//DELETE /testDescriptor/:id
router.delete("/testDescriptor/:id", async (req, res) => {
  //if (!vl.validateLogin([["manager"]]))
    //return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await testDescriptor.deleteTestDescriptor(req.params.id);
    return res.status(204).json("Success").end();
  } catch (error) {
    if(error == 422) return res.status(422).json("Validation of id failed").end();
    return res.status(503).json("Generic error").end();
  }
});

module.exports = router;
