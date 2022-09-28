const InternalOrderService = require("../services/internalorder_service");
const UserDAO = require("../modules/UserDAO");
const dao = require("../modules/InternalOrderDAO");
const internalorder_service = new InternalOrderService(dao);

describe("new internalorder", () => {
  beforeEach(async () => {
    await dao.deleteAll();
  });
  afterEach(async () => {
    await dao.deleteAll();
  });

  let products = [];

  products.push({
    SKUId: 1,
    description: "another product",
    price: 11.99,
    qty: 3,
  });
  products.push({ SKUId: 2, description: "a product", price: 10.99, qty: 3 });
  testNewInternalOrder("issueDate", 1, products);

  async function testNewInternalOrder(issueDate, customerId, products) {
    test("new internal order", async () => {
      try {
        await internalorder_service.newInternalOrder(
          issueDate,
          customerId,
          products
        );

        let res = await internalorder_service.getInternalOrders();

        expect(res[0]).toEqual({
          id: 1,
          issueDate: issueDate,
          state: "ISSUED",
          products: products,
          customerId: customerId,
        });
      } catch (e) {
        expect(e).toEqual(422);
      }
    });
  }
});

describe("edit internal order", () => {
  beforeEach(async () => {
    await dao.deleteAll();
  });
  afterEach(async () => {
    await dao.deleteAll();
  });

  let products = [];

  products.push({
    SKUId: 1,
    description: "another product",
    price: 11.99,
    qty: 3,
  });
  products.push({ SKUId: 2, description: "a product", price: 10.99, qty: 3 });

  let productsEdit = [];
  productsEdit.push({
    SkuID: 1,
    RFID: 2039210,
  });
  productsEdit.push({ SkuID: 2, RFID: 298391 });
  testEditInternalOrder(1, "COMPLETED");

  async function testEditInternalOrder(id, newState, productsEdit) {
    test("new internal order", async () => {
      try {
        await internalorder_service.newInternalOrder("issueDate", id, products);

        let res = await internalorder_service.editInternalOrder(
          id,
          newState,
          productsEdit
        );
        if (res[0].newState == "COMPLETED") {
          expect(res[0]).toEqual({
            newState: "COMPLETED",
            products: productsEdit,
          });
        } else {
          expect(res[0]).toEqual({
            newState: newState,
          });
        }
      } catch (e) {
        expect(e).toEqual(422);
      }
    });
  }
});
