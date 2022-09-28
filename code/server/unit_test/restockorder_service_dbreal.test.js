const RestockOrderService = require("../services/restockorder_service");
const SkuItemDAO = require("../modules/SkuItemDAO");
const SkuItemService = require("../services/skuitem_service");
const SkuDAO = require("../modules/SkuDAO");
const skuItem_service = new SkuItemService(SkuItemDAO, SkuDAO);
const ItemDAO = require("../modules/ItemDAO");
const dao = require("../modules/RestockOrderDAO");
const restockorder_service = new RestockOrderService(dao, ItemDAO, SkuDAO);
const ItemService = require("../services/item_service");
const item_service = new ItemService(ItemDAO, SkuDAO);
const SkuService = require("../services/sku_service");
const PositionDAO = require("../modules/PositionDAO");
const sku_service = new SkuService(SkuDAO, PositionDAO);

describe("new restock order", () => {
  beforeEach(async () => {
    await dao.deleteAll();
    await ItemDAO.deleteAll();
    await SkuItemDAO.deleteAll();
    await SkuDAO.deleteAll();
  });
  afterEach(async () => {
    await dao.deleteAll();
    await ItemDAO.deleteAll();
    await SkuItemDAO.deleteAll();
    await SkuDAO.deleteAll();
  });

  let products = [];

  products.push({
    SKUId: 1,
    itemId: 10,
    description: "a product",
    price: 10.99,
    qty: 30,
  });
  products.push({ SKUId: 2, itemId: 18, description: "another product", price: 11.99, qty: 20});

  testNewRestockOrder("issueDate", 2, products);

  async function testNewRestockOrder(issueDate, supplierId, products) {
    test("new restock order", async () => {
      try {
        // Creating SKUs
        await sku_service.newSku("a new sku", 100, 50, "first SKU", 10.99, 50);
        await sku_service.newSku("a new sku", 100, 50, "second SKU", 10.99, 50);
        // Creating Items
        await item_service.newItem(10, "a new item", 10.99, 1, 2);
        await item_service.newItem(18, "a new item", 10.99, 2, 2);
        // Creating restock order
        await restockorder_service.newRestockOrder(
          issueDate,
          supplierId,
          products
        );

        let res = await restockorder_service.getRestockOrders();

        expect(res[0]).toEqual({
          id: 1,
          issueDate: issueDate,
          state: "ISSUED",
          products: products,
          supplierId: supplierId,
          transportNote: [],
          skuItems: [],
        });
      } catch (e) {
        console.log(e);
      }
    });
  }
});

describe('add skuitems to restockorder', () => {
  beforeEach(async () => {
    await dao.deleteAll();
    await ItemDAO.deleteAll();
    await SkuItemDAO.deleteAll();
    await SkuDAO.deleteAll();
  });
   afterEach(async () => {
     await dao.deleteAll();
     await ItemDAO.deleteAll();
     await SkuItemDAO.deleteAll();
     await SkuDAO.deleteAll();
   });
  let products = [];

  products.push({
    SKUId: 1,
    itemId: 10,
    description: "a product",
    price: 10.99,
    qty: 30,
  });
  products.push({ SKUId: 2, itemId: 18, description: "another product", price: 11.99, qty: 20});
  
  let skuItems = [];

  skuItems.push({
    SKUId: 3,
    itemId: 11,
    rfid: 1,
  });
  skuItems.push({
    SKUId: 4,
    itemId: 12,
    rfid: 2,
  })
  testAddSkuItem("issueDate", 2, products, skuItems);


  async function testAddSkuItem(issueDate, supplierId, products, skuItems) {
    test('add sku item to restock order', async() => {
      try {
      // Creating SKUs
      await sku_service.newSku("a new sku", 100, 50, "first SKU", 10.99, 50);
      await sku_service.newSku("a new sku", 100, 50, "second SKU", 10.99, 50);
      await sku_service.newSku("a new sku", 100, 50, "third SKU", 10.99, 50);
      await sku_service.newSku("a new sku", 100, 50, "fourth SKU", 10.99, 50);
      // Creating SkuItems
      await skuItem_service.newSkuItem(1, 1, "DateOfStock");
      await skuItem_service.newSkuItem(2, 2, "DateOfStock");
      // Creating Items
      await item_service.newItem(10, "a new item", 10.99, 1, 2);
      await item_service.newItem(18, "a new item", 10.99, 2, 2);
      // Creating restock order
      await restockorder_service.newRestockOrder(
        issueDate,
        supplierId,
        products
      );
      // Edit state of the restock order
      await restockorder_service.editState(1, "DELIVERED");
      // Edit the restock order as soon as created
      await restockorder_service.addSkuItemsToRO(1, skuItems);
      // Check if ok
      let res = await restockorder_service.getRestockOrders();
      expect(res[0].skuItems.length).toEqual(2);
      } catch (error) {
        console.log(error);
      }

    })
  }
})

describe("edit restock order state", () => {
  beforeEach(async () => {
    await dao.deleteAll();
    await SkuItemDAO.deleteAll();
  });
  afterEach(async () => {
    await dao.deleteAll();
    await SkuItemDAO.deleteAll();
  });

  testEditRestockOrder(1, "DELIVERED");
  testEditRestockOrder(1, undefined);

  async function testEditRestockOrder(id, newState) {
    test("edit restock order state", async () => {
      try {
        let products = [];
        products.push({
          SKUId: 1,
          description: "another product",
          price: 11.99,
          qty: 3,
        });
        products.push({
          SKUId: 2,
          description: "a product",
          price: 10.99,
          qty: 3,
        });

        await restockorder_service.newRestockOrder("issueDate", 1, products);
        await restockorder_service.editState(id, newState);

        SkuItemDAO.newSkuItem("2109", 1, "date");

        let res = await restockorder_service.getRestockOrders();

        expect(res[0]).toEqual({
          id: 1,
          issueDate: "issueDate",
          state: "DELIVERED",
          products: products,
          supplierId: 1,
          transportNote: [],
          skuItems: [],
        });
      } catch (e) {
        expect(e).toEqual(422);
      }
    });
  }
});

/*
describe("edit restock order state with no restockorder", () => {
  beforeEach(async () => {
    await dao.deleteAll();
    await SkuItemDAO.deleteAll();
  });
  afterEach(async () => {
    await dao.deleteAll();
    await SkuItemDAO.deleteAll();
  });

  testEditMissRestockOrder(1, "DELIVERED");

  async function testEditMissRestockOrder(id, newState) {
    test("edit restock order state", async () => {
      try {
        await restockorder_service.editState(id, newState);
      } catch (e) {
        expect(e).toEqual(404);
      }
    });
  }
});
*/

describe("add transport note exception", () => {
  beforeEach(async () => {
    await dao.deleteAll();
    await SkuItemDAO.deleteAll();
  });
  afterEach(async () => {
    await dao.deleteAll();
    await SkuItemDAO.deleteAll();
  });

  testAddTransportNote(1, "transport note 1");
  testAddTransportNote(1, undefined);

  //add transport note exception
  testAddTransportNoteError(1, "transportNoteError");

  async function testAddTransportNote(id, transportNote) {
    test("add transport note ", async () => {
      try {
        let products = [];
        products.push({
          SKUId: 1,
          description: "another product",
          price: 11.99,
          qty: 3,
        });
        products.push({
          SKUId: 2,
          description: "a product",
          price: 10.99,
          qty: 3,
        });

        await restockorder_service.newRestockOrder("issueDate", 1, products);

        //change state in DELIVERED
        await restockorder_service.editState(1, "DELIVERED");

        //add transport note
        await restockorder_service.addTransportNote(id, transportNote);

        let res = await restockorder_service.getRestockOrders();

        expect(res[0]).toEqual({
          id: 1,
          issueDate: "issueDate",
          state: "DELIVERED",
          products: products,
          supplierId: 1,
          transportNote: [{ deliveryDate: null }],
          skuItems: [],
        });
      } catch (e) {
        expect(e).toEqual(422);
      }
    });
  }

  async function testAddTransportNoteError(id, transportNote) {
    test("add transport note exception", async () => {
      try {
        let products = [];
        products.push({
          SKUId: 1,
          description: "another product",
          price: 11.99,
          qty: 3,
        });
        products.push({
          SKUId: 2,
          description: "a product",
          price: 10.99,
          qty: 3,
        });

        await restockorder_service.newRestockOrder("issueDate", 1, products);

        //not change state in DELIVERED
        // await restockorder_service.editState(1, "DELIVERED");

        //add transport note
        await restockorder_service.addTransportNote(id, transportNote);
      } catch (e) {
        expect(e).toEqual(422);
      }
    });
  }
});
