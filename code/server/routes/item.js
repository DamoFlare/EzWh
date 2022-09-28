var express = require("express");
const sqlite = require("sqlite3");
var router = express.Router();
const ItemService = require("../services/item_service");
const ValidateLogin = require("../modules/ValidateLogin");
const vl = new ValidateLogin();

const dao = require("../modules/ItemDAO");
const skudao = require("../modules/SkuDAO");
const item = new ItemService(dao, skudao);

//GET /items
router.get("/items", async (req, res) => {
  // if (!vl.validateLogin(["", "Supplier"]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await item.getItems();
    return res.status(200).json(result).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json("Generic Error").end();
  }
});

/*
//GET /items/:id
router.get("/items/:id", async (req, res) => {
  // if (!vl.validateLogin(["manager"]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await item.getItemById(req.params.id);
    return res.status(200).json(result).end();
  } catch (error) {
    if (error == 404)
      return res.status(404).json("No item associated to id").end();
    if (error == 422)
      return res.status(422).json("validation of body failed").end();
    return res.status(500).json(error).end();
  }
});
*/

//GET /items/:id/:supplierId
router.get("/items/:id/:supplierId", async(req, res) => {
  try {
    const result = await item.getItemByIdAndSupplierId(req.params.id, req.params.supplierId);
    return res.status(200).json(result).end();
  } catch (error) {
    if(error == 404) return res.status(404).end();
    if(error == 422) return res.status(422).end();
    return res.status(500).end();
  }
})

//POST /item
router.post("/item", async (req, res) => {
  //  if (!vl.validateLogin(["Supplier"]))
  //    return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await item.newTableItem();
    await item.newItem(
      req.body.id,
      req.body.description,
      req.body.price,
      req.body.SKUId,
      req.body.supplierId
    );
    return res.status(201).json("Success").end();
  } catch (error) {
    if (error == 404) return res.status(404).json("Sku not found").end();
    if ((error = 422))
      return res
        .status(422)
        .json(
          "Validation of request body failed or this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID"
        )
        .end();
    return res.status(503).json("Generic error").end();
  }
});

/*
//PUT /item/:id
router.put("/item/:id", async (req, res) => {
  //  if (!vl.validateLogin(["Supplier"]))
  //    return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await item.editItem(
      req.params.id,
      req.body.newDescription,
      req.body.newPrice
    );
    return res.status(200).json("Success").end();
  } catch (error) {
    if (error == 404) return res.status(404).json("Item not existing").end();
    if ((error = 422))
      return res.status(422).json("Validation of request body failed").end();
    return res.status(503).json("Generic error").end();
  }
});
*/

//PUT /item/:id/supplierId
router.put("/item/:id/:supplierId", async(req, res) => {
  try {
    await item.editItem(req.params.id, req.params.supplierId, req.body.newDescription, req.body.newPrice);
    return res.status(200).end();
  } catch (error) {
    if (error == 404) return res.status(404).end();
    if (error == 422) return res.status(422).end();
    return res.status(503).end();
  }
})

//DELETE /items/:id/:supplierId
router.delete("/items/:id/:supplierId", async (req, res) => {
  // if (!vl.validateLogin(["Supplier"]))
  //  return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await item.deleteItem(req.params.id, req.params.supplierId);
    return res.status(204).json("Success").end();
  } catch (error) {
    if ((error = 422))
      return res.status(422).json("Validation of id failed").end();
    return res.status(503).json("Generic error").end();
  }
});

//DELETE ALL
router.delete("/item/deleteAll", async(req, res) => {
  try {
    await item.deleteAll();
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json(error).end();
  }
})

module.exports = router;
