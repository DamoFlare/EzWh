var express = require("express");
const sqlite = require("sqlite3");
var router = express.Router();
const PositionService = require("../services/position_service");
const ValidateLogin = require("../modules/ValidateLogin");
const vl = new ValidateLogin();

const dao = require("../modules/PositionDAO");

const position = new PositionService(dao);


//GET /positions
router.get("/positions", async (req, res) => {
  // if (!vl.validateLogin([["manager"], "Clerk"]))
  //   res.status(401).json("Not logged in or wrong permissions").end();
  try {
    const result = await position.getPositions();
    return res.status(200).json(result).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json("Generic error").end();
  }
});

//POST /position
router.post("/position", async (req, res) => {
  // if (!vl.validateLogin(["manager"]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await position.newTablePosition();
    await position.newPosition(req.body.positionID, req.body.aisleID, req.body.row, req.body.col, req.body.maxWeight, req.body.maxVolume)
    return res.status(201).json("Created").end();
  } catch (error) {
    if(error == 422) return res.status(422).json("validation of request body failed").end();
    return res.status(503).json("Generic error").end();
  }
});

//PUT /position/:positionID
router.put("/position/:positionID", async (req, res) => {
  // if (!vl.validateLogin([["manager"], "Clerk"]))
  //   return res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await position.editPosition(req.params.positionID, req.body.newAisleID, req.body.newRow, req.body.newCol, req.body.newMaxWeight, req.body.newMaxVolume, req.body.newOccupiedWeight, req.body.newOccupiedVolume);
    return res.status(200).json("Success").end();
  } catch (error) {
    if(error == 422) return res.status(422).json("validation of request body or of positionID failed").end();
    if(error == 404) return res.status(404).json("no position associated to positionID").end()
    return res.status(503).json("Generic error").end();
  }
});

//PUT /position/:positionID/changeID
router.put("/position/:positionID/changeID", async (req, res) => {
  // if (!vl.validateLogin(["manager"]))
  //   res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await position.changePositionID(req.params.positionID, req.body.newPositionID);
    return res.status(200).json("Success").end();
  } catch (error) {
    if(error == 422) return res.status(422).json("validation of request body or of positionID failed").end();
    if(error == 404) return res.status(404).json("no position associated to positionID").end()
    return res.status(503).json("Generic error").end();
  }
});

//DELETE /position/:positionID
router.delete("/position/:positionID", async (req, res) => {
  // if (!vl.validateLogin(["manager"]))
  //   res.status(401).json("Not logged in or wrong permissions").end();
  try {
    await position.deletePosition(req.params.positionID);
    return res.status(204).json("Success").end();
  } catch (error) {
    if(error == 422) return res.status(422).json("validation of positionID failed").end();
    return res.status(500).json("Generic error").end();
  }
});

router.delete("/position/deleteAll", async(req, res) => {
  try {
    await position.deleteAll();
    return res.status(204);
  } catch (error) {
    return res.status(500);
  }
})


module.exports = router;
