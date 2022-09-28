class PositionService {
  dao;

  constructor(dao) {
    this.dao = dao;
  }

  newTablePosition = async () => {
    const result = await this.dao.newTablePosition();
    return result;
  };

  getPositions = async () => {
    const result = await this.dao.getPositions();
    return result;
  };

  newPosition = async (positionID, aisleID, row, col, maxWeight, maxVolume) => {
    if (positionID == null || aisleID == null || maxVolume < 0 || maxWeight < 0)
      throw 422;
    const result = await this.dao.newPosition(
      positionID,
      aisleID,
      row,
      col,
      maxWeight,
      maxVolume
    );
  };

  editPosition = async (
    positionID,
    newAisleID,
    newRow,
    newCol,
    newMaxWeight,
    newMaxVolume,
    newOccupiedWeight,
    newOccupiedVolume
  ) => {
    if (
      newMaxWeight < 0 ||
      newMaxVolume < 0 
    ){
      throw 422;
    }
    const positions = await this.dao.getPositions();
    const position = positions.filter((e) => e.positionID == positionID);
    if (position.length == 0) throw 404;
    const result = await this.dao.editPositionById(
      positionID,
      newAisleID,
      newRow,
      newCol,
      newMaxWeight,
      newMaxVolume,
      newOccupiedWeight,
      newOccupiedVolume
    );
    return result;
  };

  changePositionID = async (positionID, newPositionID) => {
    if (positionID == undefined || newPositionID == undefined) throw 422;
    const positions = await this.dao.getPositions();
    const position = await positions.filter((e) => e.positionID == positionID);
    if (position.length == 0) throw 404;
    const result = await this.dao.changePositionIDByID(
      positionID,
      newPositionID
    );
    return result;
  };

  deletePosition = async (positionID) => {
    let found = false;
    let positions = await this.dao.getPositions();
    positions.forEach((element) => {
      if (element.positionID == positionID) found = true;
    });
    if (positionID == undefined || found == false) throw 422;
    const result = await this.dao.deletePositionByID(positionID);
    return result;
  };

  deleteAll = async () => {
    const result = await this.dao.deleteAll();
    return result;
  };
}
module.exports = PositionService;
