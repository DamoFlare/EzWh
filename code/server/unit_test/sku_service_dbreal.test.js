const SkuService = require("../services/sku_service");
const testDescriptorDAO = require("../modules/TestDescriptorDAO");
const skuDao = require("../modules/SkuDAO");
const positionDao = require("../modules/PositionDAO");
const sku_service = new SkuService(skuDao, positionDao);
describe("new sku", () => {
  beforeEach(async () => {
    await skuDao.deleteAll();
    await testDescriptorDAO.deleteAll();
  });

  afterEach(async () => {
    await skuDao.deleteAll();
    await testDescriptorDAO.deleteAll();
  });

  testNewSku("a new sku", 20, 30, "first sku", 10.99, 50);

  async function testNewSku(
    description,
    weight,
    volume,
    notes,
    price,
    availableQuantity
  ) {
    test("new sku", async () => {
      try {
        await sku_service.newSku(
          description,
          weight,
          volume,
          notes,
          price,
          availableQuantity
        );
        await testDescriptorDAO.newTestDescriptor(
          "test descriptor",
          "this is the procedure...",
          1
        );
        let res = await sku_service.getSkus();
        let testDescriptorList = await testDescriptorDAO.getTestDescriptors();
        expect(res[0]).toEqual({
          id: 1,
          description: description,
          weight: weight,
          volume: volume,
          notes: notes,
          price: price,
          availableQuantity: availableQuantity,
          position: null,
          testDescriptors: [],
        });  
      } catch (error) {
        console.log(error);
      }
    });
  }
});

describe("modify sku", () => {
  beforeEach(async () => {
    await skuDao.deleteAll();
  });

  afterEach(async () => {
    await skuDao.deleteAll();
  });

  testEditSku(1, "an edited sku", 200, 300, "edited sku", 100.99, 500);
  testEditSkuWithNoSkus(
    1,
    "an edited sku",
    200,
    300,
    "edited sku",
    100.99,
    500
  );

  async function testEditSku(
    id,
    newDescription,
    newWeight,
    newVolume,
    newNotes,
    newPrice,
    newAvailableQuantity
  ) {
    test("modify sku", async () => {
      try {
        await sku_service.newSku("a new sku", 20, 30, "first sku", 10.99, 50);
        await sku_service.editSku(
          id,
          newDescription,
          newWeight,
          newVolume,
          newNotes,
          newPrice,
          newAvailableQuantity
        );
        await testDescriptorDAO.newTestDescriptor(
          "test descriptor",
          "this is the procedure...",
          1
        );

        let res = await sku_service.getSkus();
        let testDescriptorList = await testDescriptorDAO.getTestDescriptors();
        expect(res[0]).toEqual({
          id: 1,
          description: newDescription,
          weight: newWeight,
          volume: newVolume,
          notes: newNotes,
          price: newPrice,
          availableQuantity: newAvailableQuantity,
          position: null,
          testDescriptors: [],
          //testDescriptors: [testDescriptorList[0].id],
        });
      } catch (e) {
        //console.log(e);
        expect(e).toEqual(422);
      }
    });
  }

  async function testEditSkuWithNoSkus(
    id,
    newDescription,
    newWeight,
    newVolume,
    newNotes,
    newPrice,
    newAvailableQuantity
  ) {
    test("modify sku that doesnt exist", async () => {
      try {
        let res = await sku_service.editSku(
          id,
          newDescription,
          newWeight,
          newVolume,
          newNotes,
          newPrice,
          newAvailableQuantity
        );
        expect(res).not.toEqual(true);
      } catch (e) {
        expect(e).toEqual(404);
      }
    });
  }
});

describe("edit sku position", () => {
  beforeEach(async () => {
    await skuDao.deleteAll();
    await testDescriptorDAO.deleteAll();
    await positionDao.deleteAll();
  });

  afterEach(async () => {
    await skuDao.deleteAll();
    await testDescriptorDAO.deleteAll();
    await positionDao.deleteAll();
  });

  testEditSkuPosition(1, 800234543412);

  async function testEditSkuPosition(id, positionId) {
    test("new sku", async () => {
      await sku_service.newSku("description", 10, 20, "notes", 10.99, 50);
      await positionDao.newPosition(positionId, 8002, 3454, 3412, 1000, 1000);

      await sku_service.editSkuPosition(id, positionId);
      let res = await sku_service.getSkus();
      expect(res[0]).toEqual({
        id: 1,
        description: "description",
        weight: 10,
        volume: 20,
        notes: "notes",
        price: 10.99,
        availableQuantity: 50,
        position: positionId,
        testDescriptors: [],
      });
    });
  }
});
