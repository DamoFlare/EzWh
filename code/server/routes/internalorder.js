var express = require("express");
const sqlite = require("sqlite3");
var router = express.Router();
var InternalOrderService = require("../services/internalorder_service");
const ValidateLogin = require("../modules/ValidateLogin");
const vl = new ValidateLogin();

const dao = require("../modules/InternalOrderDAO");
const internalOrder = new InternalOrderService(dao)

/* Init database */
let db = new sqlite.Database("EzWhDB.sqlite", (err) => {
  if (err) throw err;
});

//GET /api/internalOrders
router.get("/internalOrders", async (req, res) => {
  if (!vl.validateLogin(["manager"]))
    return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await internalOrder.getInternalOrders();
    return res.status(200).json(result).end();
  } catch (error) {
    return res.status(500).json(error).end();
  }
});

//GET /api/internalOrdersIssued
router.get("/internalOrdersIssued", async (req, res) => {
  if (!vl.validateLogin([["manager"], "Customer"]))
    return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await internalOrder.getInternalOrdersIssued();
    return res.status(200).json(result).end();
  } catch (error) {
    return res.status(500).json("Generic error").end();
  }
});

//GET /api/internalOrdersAccepted
router.get("/internalOrdersAccepted", async (req, res) => {
  if (!vl.validateLogin([["manager"], "Delivery Employee"]))
    return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await internalOrder.getInternalOrdersAccepted();
    return res.status(200).json(result).end();
  } catch (error) {
    return res.status(500).json("Generic error").end();
  }
});

//GET /api/internalOrders/:id
router.get("/internalOrders/:id", async (req, res) => {
  if (!vl.validateLogin([["manager"], "Delivery Employee"]))
    return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await internalOrder.getInternalOrdersById(req.params.id);
    return res.status(200).json(result).end();
  } catch (error) {
    if (error == 404)
      return res.status(404).json("No Internal Order associated to id").end();
    return res.status(500).json("Generic error").end();
  }
});

//POST /api/internalOrders
router.post("/internalOrders", async (req, res) => {
  if (!vl.validateLogin([["manager"], "Customer"]))
    return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await internalOrder.newTableInternalOrder();
    await internalOrder.newTableProducts();
    await internalOrder.newInternalOrder(req.body.issueDate, req.body.customerId, req.body.products);
    return res.status(201).json("Success").end();
  } catch (error) {
    if(error == 422)
      return res.status(422).json('Validation of request body or of id failed').end()
    if(error == 404)
      return res.status(404).json('User (customerID) not found').end();
    return res.status(503).json("Generic error").end();
  }
});

//PUT /api/internalOrders/:id
router.put("/internalOrders/:id", async (req, res) => {
  if (!vl.validateLogin([["manager"], "Delivery Employee"]))
    res.status(401).json("Not logged in or wrong permissions").end();
  try {
    internalOrder.editInternalOrder(req.params.id, req.body.newState, req.body.params);
    res.status(200).json("Success").end();
  } catch (error) {
    if (error == 404)
      return res.status(404).json("No Internal Order associated to id").end();
    if(error == 422)
      return res.status(422).json("Validation of request body or id failed").end();
    return res.status(503).json("Generic error").end();
  }
});

//DELETE /api/internalOrders/:id
router.delete("/internalOrders/:id", async (req, res) => {
  if (!vl.validateLogin([["manager"]]))
    return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await internalOrder.deleteInternalOrder(req.params.id);
    return res.status(204).json("Success").end();
  } catch (error) {
    if(error == 422)
      return res.status(422).json("Validation of id failed").end();
      console.log(error);
    return res.status(503).json(error).end();
  }
});

module.exports = router;
