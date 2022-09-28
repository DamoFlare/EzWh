var express = require("express");
const sqlite = require("sqlite3");
var router = express.Router();
const SkuService = require("../services/sku_service");
const ValidateLogin = require("../modules/ValidateLogin");
const vl = new ValidateLogin();

const dao = require("../modules/SkuDAO");
const positiondao = require("../modules/PositionDAO");
const sku = new SkuService(dao, positiondao);

//GET /api/skus
router.get("/skus", async (req, res) => {
  //if (!vl.validateLogin([["manager"], "Customer", "Clerk"]))
    //return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await sku.getSkus();
    return res.status(200).json(result).end();
  } catch (error) {
    console.log(result);
    return res.status(500).json("Generic error").end();
  }
});

//GET /api/skus/:id
router.get("/skus/:id", async (req, res) => {
  // if (!vl.validateLogin([["manager"]]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await sku.getSkusById(req.params.id);
    return res.status(200).json(result).end();
  } catch (error) {
    if (error == 404)
      return res.status(404).json("No SKU associated to id").end();
    if(error == 422) return res.status(422).json("Validation of request body failed").end();
    return res.status(500).json("Generic error").end();
  }
});

//POST /api/sku
router.post("/sku", async (req, res) => {
  // if (!vl.validateLogin([["manager"]]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  if (Object.keys(req.body).length != 6)
    return res.status(422).json("Validation of request body failed").end();
  try {
    await sku.newTableSku();
    await sku.newSku(req.body.description, req.body.weight, req.body.volume, req.body.notes, req.body.price, req.body.availableQuantity);
    return res.status(201).json("Success").end();
  } catch (error) {
    console.log(error);
    if (error == 422) return res.status(422).json("Validation of request body failed").end();
    return res.status(503).json("Generic error").end();
  }
});

//PUT /api/sku/:id
router.put("/sku/:id", async (req, res) => {
  // if (!vl.validateLogin([["manager"]]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await sku.editSku(req.params.id, req.body.newDescription, req.body.newWeight, req.body.newVolume, req.body.newNotes, req.body.newPrice, req.body.newAvailableQuantity);
    return res.status(200).json("Success").end();
  } catch (error) {
    if (error == 404) return res.status(404).json("SKU not existing").end();
    if (error == 422)
      return res
        .status(422)
        .json(
          "newAvailableQuantity position is not capable enough in weight or in volume"
        )
        .end();
        console.log(error);
    return res.status(503).json(error).end();
  }
});

//PUT /api/sku/:id/position
router.put("/sku/:id/position", async (req, res) => {
  // if (!vl.validateLogin([["manager"]]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await sku.editSkuPosition(req.params.id, req.body.position);
    return res.status(200).json("Success").end();
  } catch (error) {
    if(error == 404) return res.status(404).json('Position not existing or SKU not existing').end();
    if(error == 422) return res.status(422).json('Validation of position through the algorithm failed or position isn\'t capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku').end();
    return res.status(503).json("Generic error").end();
  }
});

//DELETE /api/sku/:id
router.delete("/skus/:id", async (req, res) => {
  // if (!vl.validateLogin([["manager"]]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await sku.deleteSku(req.params.id);
    return res.status(204).json("Success").end();
  } catch (error) {
    console.log(error);
    return res.status(503).json("Generic error").end();
  }
});

//DELETE /api/sku/deleteAll
router.delete("/sku/deleteAll", async(req, res) => {
  await sku.deleteAll();
  return res.status(204).end();
})

module.exports = router;
