var express = require("express");
const sqlite = require("sqlite3");
var router = express.Router();
const ReturnOrderService = require("../services/returnorder_service");
const ValidateLogin = require("../modules/ValidateLogin");
const vl = new ValidateLogin();

const dao = require("../modules/ReturnOrderDAO");
const restockorderdao = require("../modules/RestockOrderDAO");

const returnOrder = new ReturnOrderService(dao, restockorderdao);


/* Init database */
let db = new sqlite.Database("EzWhDB.sqlite", (err) => {
  if (err) throw err;
});

//GET /returnOrders
router.get("/returnOrders", async (req, res) => {
  // if (!vl.validateLogin(["manager"]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await returnOrder.getReturnOrders();;
    return res.status(200).json(result).end();
  } catch (error) {
    return res.status(500).json(error).end();
  }
});

//GET /returnOrders/:id
router.get("/returnOrders/:id", async (req, res) => {
  // if (!vl.validateLogin(["manager"]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await returnOrder.getReturnOrderByID(req.params.id);
    return res.status(200).json(result).end();
  } catch (error) {
    if(error == 422) return res.status(422).json("validation of id failed").end();
    if(error == 404) return res.status(404).json("no return order associated to id").end();
    return res.status(500).json("Generic error").end();
  }
});

//POST /returnOrder
router.post("/returnOrder", async (req, res) => {
  // if (!vl.validateLogin(["manager"]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await returnOrder.newTableReturnOrder();
    await returnOrder.newTableProducts();
    await returnOrder.newReturnOrder(req.body.returnDate, req.body.products, req.body.restockOrderId);
    return res.status(201).json("Success").end();
  } catch (error) {
    if(error == 422) return res.status(422).json("validation of request body failed").end();
    if(error == 404) return res.status(404).json("no restock order associated to restockOrderId").end();
    return res.status(503).json(error).end();
  }
});

//DELETE /returnOrder/:id
router.delete("/returnOrder/:id", async (req, res) => {
  // if (!vl.validateLogin(["manager"]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await returnOrder.deleteReturnOrder(req.params.id);
    return res.status(204).json("Success").end();
  } catch (error) {
    if(error == 422) return res.status(422).json("validation of id failed").end();
    return res.status(503).json(error).end();
  }
});

router.delete("/returnOrder/deleteAll", async(req, res) => {
  try {
    await returnOrder.deleteAll();
    return res.status(204);
  } catch (error) {
    return res.status(500);
  }
})

module.exports = router;
