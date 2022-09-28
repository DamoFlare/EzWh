const ReturnOrderService = require("../services/returnorder_service");
const dao = require("../modules/ReturnOrderDAO");
const restockorderdao = require("../modules/RestockOrderDAO");
const returnorder_service = new ReturnOrderService(dao, restockorderdao);
const ItemDAO = require("../modules/ItemDAO");
const ItemService = require("../services/item_service");
const SkuDAO = require("../modules/SkuDAO");
const item_service = new ItemService(ItemDAO, SkuDAO);
const RestockOrderService = require("../services/restockorder_service");
const restockorder_service = new RestockOrderService(restockorderdao, ItemDAO, SkuDAO);
const SkuService = require("../services/sku_service");
const PositionDAO = require("../modules/PositionDAO");
const sku_service = new SkuService(SkuDAO, PositionDAO);
const SkuItemDAO = require("../modules/SkuItemDAO");
const SkuItemService = require("../services/skuitem_service");
const skuItem_service = new SkuItemService(SkuItemDAO, SkuDAO);

describe("new return order", () => {
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

  let productsRO = [];

  //create products
  productsRO.push({
    SKUId: 1,
    itemId: 10,
    description: "a product",
    price: 10.99,
    qty: 30,
  });
  productsRO.push({ SKUId: 2, itemId: 18, description: "another product", price: 11.99, qty: 20});

  let productsReturnO = [];
  productsReturnO.push({
    SKUId: 1,
    itemId: 10,
    description: "a product",
    price: 10.99,
    RFID: 1,
  });
  productsReturnO.push({
    SKUId: 2,
    itemId: 18,
    description: "a product",
    price: 10.99,
    RFID: 2,
  });

  testNewReturnOrder("issueDate", productsRO, 1, productsReturnO);

  async function testNewReturnOrder(returnDate, productsRO, restockOrderId, productsReturnO) {
    test("edit test result", async () => {
      try {
        await returnorder_service.newTableProducts();
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
          "issueDate",
          2,
          productsRO
        );
        // Creating return orders
        await returnorder_service.newReturnOrder(returnDate, productsReturnO, 1);
        let res = await returnorder_service.getReturnOrders();

        expect(res[0].id).toEqual(1);
        expect(res[0].returnDate).toEqual(returnDate);
        //expect(res[0].products).toEqual(productsReturnO);
        expect(res[0].restockOrderId).toEqual(restockOrderId);
      } catch (e) {
        console.log(e);
      }
    });
  }
});
