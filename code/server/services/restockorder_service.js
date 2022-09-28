class RestockOrderService {
  dao;
  itemDao;
  skuDao;

  constructor(dao, itemDao, skuDao) {
    this.dao = dao;
    this.itemDao = itemDao;
    this.skuDao = skuDao;
  }

  newTableRestockOrder = async () => {
    const result = await this.dao.newTableRestockOrder();
    return result;
  };

  newTableProducts = async () => {
    const result = await this.dao.newTableProducts();
    return result;
  };

  newTableTransportNote = async () => {
    const result = await this.dao.newTableTransportNote();
    return result;
  };

  newRestockOrder = async (issueDate, supplierId, products) => {
    const allSkus = await this.skuDao.getSkus();
    const allItems = await this.itemDao.getItems();
    let result;
    let match = 0;
    console.log(allSkus)
    console.log(allItems)
    products.forEach((p) => {
      result = allItems.filter((i) => i.id == p.itemId && i.supplierId == supplierId);
      if(result.length != 0 )
        match=1;
    })
    products.forEach((p) => {
      result = allSkus.filter((s) => s.id == p.SKUId);
      if(result.length != 0)
        match=1;
    })
    if(!match) throw 422;
    if (Number.isNaN(parseInt(supplierId)) || products == undefined || products.length == 0) throw 422;
    result = await this.dao.newRestockOrder(
      issueDate,
      supplierId,
      products
    );
    return result;
  };

  editState = async (id, newState) => {
    if (id == undefined || newState == undefined) throw 422;
    const restockOrders = await this.dao.getRestockOrders();
    const restockOrder = await restockOrders.filter((e) => e.id == id);
    if (restockOrder.length == 0) throw 404;
    const result = await this.dao.editState(id, newState);
    return result;
  };

  addTransportNote = async (id, transportNote) => {
    if (id == undefined || transportNote == undefined) throw 422;
    const restockOrders = await this.dao.getRestockOrders();
    const restockOrder = restockOrders.filter((e) => e.id == id);
    if (restockOrder.length == 0) throw 404;
    const orderState = restockOrder[0].state;
    if (orderState != "DELIVERY") throw 422;
    const issueDate = restockOrder[0].issueDate.split(" ")[0];
    if(issueDate > transportNote.deliveryDate) throw(422);
    const result = await this.dao.addTransportNote(id, transportNote);
    return result;
  };

  getRestockOrders = async () => {
    const result = await this.dao.getRestockOrders();
    return result;
  };

  getIssuedRestockOrders = async () => {
    const restockOrders = await this.dao.getRestockOrders();
    const result = await restockOrders.filter((e) => e.state == "ISSUED");
    return result;
  };

  getRestockOrderById = async (id) => {
    if (id == undefined) throw 422;
    const restockOrders = await this.dao.getRestockOrders();
    const result = await restockOrders.filter((e) => e.id == id);
    if (result.length == 0) throw 404;
    return result;
  };

  addSkuItemsToRO = async (id, skuitems) => {
    if (id == undefined || skuitems == undefined) throw 422;
    const restockOrders = await this.dao.getRestockOrders();
    const restockOrder = await restockOrders.filter((e) => e.id == id);
    if (restockOrder.length == 0) throw 404;
    const state = restockOrder[0].state;
    if (state != "DELIVERED") throw 422;
    const result = await this.dao.addSkuItemsToRO(id, skuitems);
    return result;
  };

  getTransportNotesByROid = async (id) => {
    const result = await this.dao.getTransportNotesByROid(id);
    return result;
  };

  getSkuItemsByIdRO = async (id) => {
    const result = await this.dao.getSkuItemsByIdRO(id);
    return result;
  };

  deleteRestockOrder = async (id) => {
    if (id == undefined) throw (422);
    const result = await this.dao.deleteRestockOrder(id);
    return result;
  };

  getFailedSkuItemsByIdRO = async (id) => {
    if (id == undefined) throw 422;
    const restockOrders = await this.dao.getRestockOrders();
    const restockOrder = await restockOrders.filter((e) => e.id == id);
    if (restockOrder[0].state == "COMPLETEDRETURN") throw 422;
    const result = await this.dao.getFailedSkuItemsByIdRO(id);
    if (result.length == 0) throw 404;
    return result;
  };

  deleteAll = async () => {
    const result = await this.dao.deleteAll();
    return result;
  };
}

module.exports = RestockOrderService;
