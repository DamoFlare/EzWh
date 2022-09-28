const ItemService = require("../services/item_service");
const dao = require("../modules/ItemDAO");
const SkuDAO = require("../modules/SkuDAO");
const item_service = new ItemService(dao, SkuDAO);
const PositionDAO = require("../modules/PositionDAO");
const SKUService = require("../services/sku_service");
const sku_service = new SKUService(SkuDAO, PositionDAO)

describe("get items", () => {
    beforeEach(async () => {
        await dao.deleteAll();
    })
    afterEach(async() => {
        await dao.deleteAll();
    })
    testGetItem(12, "a new item", 10.99, 1, 2);


    async function testGetItem(id, description, price, SKUId, supplierId) {
        test("new item", async() => {
            try {
                // Create a new SKU
                await sku_service.newSku("a new sku", 100, 50, "first SKU", 10.99, 50);
                // Create a new Item
                await item_service.newItem(id, description, price, SKUId, supplierId);
                // Get the new Item as soon as created
                let res = await item_service.getItems();

                expect(res[0]).toEqual({
                    id: id,
                    description: description,
                    price: price,
                    SKUId: SKUId,
                    supplierId: supplierId
                });
            } catch (error) {
                console.log(error);
            }
        })
    }
})

describe('edit item', () => {
    beforeEach(async () => {
        await dao.deleteAll();
    })
    afterEach(async() => {
        await dao.deleteAll();
    })
    testEditItem(12, "a new item", 10.99, 1, 2, "a new sku", 11.99);

    async function testEditItem(id, description, price, SKUId, supplierId, newDescription, newPrice) {
        test('edit item', async() => {
            try {
                // Create a new SKU
                await sku_service.newSku("a new sku", 100, 50, "first SKU", 10.99, 50);
                // Create a new Item
                await item_service.newItem(id, description, price, SKUId, supplierId);
                // Edit this new Item
                await item_service.editItem(id, supplierId, newDescription, newPrice);
                // Get thhe new Item as soon as edited
                let res = await item_service.getItems();
                expect(res[0]).toEqual({
                    id: id,
                    description: newDescription,
                    price: newPrice,
                    SKUId: SKUId,
                    supplierId: supplierId
                })
            } catch (error) {
                console.log(error);
            }
        })
    }
})

describe('delete item', () => {
    beforeEach(async () => {
        await dao.deleteAll();
    })
    afterEach(async() => {
        await dao.deleteAll();
    })
    testDeleteItem(12, "a new item", 10.99, 1, 2);

    async function testDeleteItem(id, description, price, SKUId, supplierId) {
        test('delete item', async() => {
            try {
                // Create a new SKU
                await sku_service.newSku("a new sku", 100, 50, "first SKU", 10.99, 50);
                // Create a new Item
                await item_service.newItem(id, description, price, SKUId, supplierId);
                // Delete the Item
                await item_service.deleteItem(id, supplierId);
                // Check the result
                let res = await item_service.getItems();
                expect(res.length).toEqual(0);
            } catch (error) {
                console.log(error);
            }
        })
    }
})