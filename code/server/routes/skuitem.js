var express = require("express");
const sqlite = require("sqlite3");
var router = express.Router();
const SkuItemService = require("../services/skuitem_service");
const ValidateLogin = require("../modules/ValidateLogin");
const vl = new ValidateLogin();

const dao = require("../modules/SkuItemDAO");
const skudao = require("../modules/SkuDAO");

const skuitem = new SkuItemService(dao, skudao);

router.get("/skuitems", async (req, res) => {
  //if (!vl.validateLogin([["manager"]]))
    //return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await skuitem.getSkuItems();
    return res.status(200).json(result).end();
  } catch (error) {
    return res.status(500).json("Generic error").end();
  }
});

router.get("/skuitems/sku/:id", async (req, res) => {
  // if (!vl.validateLogin([["manager"], "Customer"]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await skuitem.getSkuItemsBySkuID(req.params.id);
    return res.status(200).json(result).end();
  } catch (error) {
    if(error == 422) return res.status(422).json("validation of id failed").end();
    if(error == 404) return res.status(404).json("no SKU associated to id").end();
    return res.status(500).json("Generic error").end();
  }
});

router.get("/skuitems/:rfid", async (req, res) => {
  // if (!vl.validateLogin([["manager"]]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await skuitem.getSkuItemByRFID(req.params.rfid);
    return res.status(200).json(result).end();
  } catch (error) {
    if(error == 422) return res.status(422).json("validation of rfid failed").end();
    if(error == 404) return res.status(404).json("no SKU Item associated to rfid").end();
    return res.status(500).json("Generic error").end();
  }
});

router.post(
  "/skuitem",
  async(req, res) => {
    // if (!vl.validateLogin([["manager"], "Clerk"]))
    //   return res.status(401).json("Not logged in or wrong permissions").end();
    try {
      await skuitem.newTableSkuItem();
      const result = await skuitem.newSkuItem(req.body.RFID, req.body.SKUId, req.body.DateOfStock);
      return res.status(201).json("Created").end();
    } catch (error) {
      console.log(error);
      if(error == 422) return res.status(422).json("validation of request body failed").end();
      if(error == 404) return res.status(404).json("no SKU associated to SKUId").end();
      return res.status(500).json("Generic error").end();
      }
  }
);

router.put("/skuitems/:rfid", async(req, res) => {
  // if (!vl.validateLogin([["manager"]]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await skuitem.editSkuItem(req.params.rfid, req.body.newRFID, req.body.newAvailable, req.body.newDateOfStock);
    return res.status(200).json("success").end();
  } catch (error) {
    if(error == 422) return res.status(422).json("validation of request body failed").end();
    if(error == 404) return res.status(404).json("no SKU associated to SKUId").end();
    return res.status(500).json("Generic error").end();
}
});

router.delete("/skuitems/:rfid", async(req, res) => {
  // if (!vl.validateLogin([["manager"]]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await skuitem.deleteSkuItem(req.params.rfid);
    return res.status(204).json("success").end();
  } catch (error) {
    if(error == 422) return res.status(422).json("validation of rfid failed").end();
    return res.status(503).json("Generic error").end();
  }
});

router.delete("/skuitem/deleteAll", async(req, res) => {
  try {
    await skuitem.deleteAll();
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json(error);
  }
})
module.exports = router;
