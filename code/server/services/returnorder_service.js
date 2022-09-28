class ReturnOrderService {
  dao;
  restockorderdao;

  constructor(dao, restockorderdao) {
    this.dao = dao;
    this.restockorderdao = restockorderdao;
  }

  newTableReturnOrder = async () => {
    const result = await this.dao.newTableReturnOrder();
    return result;
  };

  newTableProducts = async () => {
    const result = await this.dao.newTableProducts();
    return result;
  };

  getReturnOrders = async () => {
    const result = await this.dao.getRO();
    return result;
  };

  getReturnOrderByID = async (id) => {
    if (Number.isNaN(parseInt(id))) throw 422;
    const returnOrders = await this.dao.getRO();
    const result = await returnOrders.filter((e) => e.id == id);
    if (result.length == 0) throw 404;
    return result[0];
  };

  newReturnOrder = async (returnDate, products, restockOrderId) => {
    if (restockOrderId == null || restockOrderId == 0) throw 422;
    const restockOrders = await this.restockorderdao.getRestockOrders();
    const restockOrder = await restockOrders.filter(
      (e) => e.id == restockOrderId
    );
    if (restockOrder.length == 0) throw 404;
    const result = await this.dao.newRO(returnDate, products, restockOrderId);
    return result;
  };

  deleteReturnOrder = async (id) => {
    if (id == undefined) throw 422;
    const result = await this.dao.deleteRO(id);
  };
}
module.exports = ReturnOrderService;
