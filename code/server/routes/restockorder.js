var express = require("express");
const sqlite = require("sqlite3");
var router = express.Router();
const RestockOrderService = require("../services/restockorder_service");
const ValidateLogin = require("../modules/ValidateLogin");
const vl = new ValidateLogin();

const dao = require("../modules/RestockOrderDAO");
const itemDao = require("../modules/ItemDAO");
const skuDao = require("../modules/SkuDAO");

const restockOrder = new RestockOrderService(dao, itemDao, skuDao);

//GET /restockOrders
router.get("/restockOrders", async (req, res) => {
  // if (!vl.validateLogin(["manager", "Clerk", "Quality Employee"]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await restockOrder.getRestockOrders();
    return res.status(200).json(result).end();
  } catch (error) {
    return res.status(500).json("Generic error").end();
  }
});

//GET /restockOrdersIssued
router.get("/restockOrdersIssued", async (req, res) => {
  // if (!vl.validateLogin(["manager", "Supplier"]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await restockOrder.getIssuedRestockOrders();
    return res.status(200).json(result).end();
  } catch (error) {
    return res.status(500).json("Generic Error").end();
  }
});

//GET /restockOrders/:id
router.get("/restockOrders/:id", async (req, res) => {
  // if (!vl.validateLogin(["manager"]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await restockOrder.getRestockOrderById(req.params.id);
    return res.status(200).json(result).end();
  } catch (error) {
    if (error == 422)
      return res.status(422).json("Validation of id failed").end();
    if (error == 404)
      return res.status(404).json("No restock order associated to id").end();
    return res.status(500).json("Generic error").end();
  }
});

//GET /restockOrders/:id/returnItems
router.get("/restockOrders/:id/returnItems", async (req, res) => {
  // if (!vl.validateLogin(["manager"]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await restockOrder.getFailedSkuItemsByIdRO(req.params.id);
    return res.status(200).json(result).end();
  } catch (error) {
    if (error == 404)
      return res.status(404).json("no restock order associated to id").end();
    if (error == 422)
      return res
        .status(422)
        .json(
          "validation of id failed or restock order state != COMPLETEDRETURN"
        )
        .end();
    return res.status(500).json("Generic error").end();
  }
});

//POST /restockOrder
router.post("/restockOrder", async (req, res) => {
  // if (!vl.validateLogin(["manager"]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await restockOrder.newTableRestockOrder();
    await restockOrder.newTableProducts();
    await restockOrder.newTableTransportNote();
    await restockOrder.newRestockOrder(
      req.body.issueDate,
      req.body.supplierId,
      req.body.products
    );
    return res.status(201).json("Success").end();
  } catch (error) {
    if(error == 422) return res.status(422).end();
    return res.status(503).json("Generic error").end();
  }
});

//PUT /restockOrder/:id
router.put("/restockOrder/:id", async (req, res) => {
  // if (!vl.validateLogin(["manager"]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await restockOrder.editState(req.params.id, req.body.newState);
    return res.status(200).json("Success").end();
  } catch (error) {
    if (error == 404)
      return res.status(404).json("No restock order associated to id").end();
    if (error == 422)
      return res
        .status(422)
        .json("Validation of id or request body failed")
        .end();
    return res.status(503).json("Generic error").end();
  }
});

//PUT /restockOrder/:id/skuItems
router.put("/restockOrder/:id/skuItems", async (req, res) => {
  // if (!vl.validateLogin(["manager"]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await restockOrder.addSkuItemsToRO(req.params.id, req.body.skuItems);
    return res.status(200).json("Success").end();
  } catch (error) {
    if (error == 422)
      return res
        .status(422)
        .json(
          "validation of request body or of id failed or order state != DELIVERED"
        )
        .end();
    if (error == 404)
      return res.status(404).json("No restock order associated to id").end();
    return res.status(503).json("Generic error").end();
  }
});

//PUT /restockOrder/:id/transportNote
router.put("/restockOrder/:id/transportNote", async (req, res) => {
  // if (!vl.validateLogin(["manager"]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
try {
  await restockOrder.addTransportNote(req.params.id, req.body.transportNote);
  return res.status(200).json("Success").end();
} catch (error) {
  if(error == 404) return res.status(404).json("No restock order associated to id").end();
  if(error == 422) return res.status(422).json("(validation of request body or of id failed or order state != DELIVERY or deliveryDate is before issueDate").end();
  return res.status(503).json("Generic error").end();
}    
})

//DELETE /restockOrder/:id
router.delete("/restockOrder/:id", async (req, res) => {
  // if (!vl.validateLogin(["manager"]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await restockOrder.deleteRestockOrder(req.params.id);
    return res.status(204).json("Success").end();
  } catch (error) {
    if (error == 422)
      return res.status(422).json("Validation of id failed").end();
    return res.status(503).json("Generic error").end();
  }
});


router.delete("/restockOrder/deleteAll", async(req, res) => {
  try {
    await restockOrder.deleteAll();
    return res.status(204).end();
  } catch (error) {
    return res.status(500);
  }
})


module.exports = router;
