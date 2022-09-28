class ItemService {
  dao;
  skudao;

  constructor(dao, skudao) {
    this.dao = dao;
    this.skudao = skudao;
  }

  newTableItem = async () => {
    const result = await this.dao.newTableItem();
    return result;
  };

  getItems = async () => {
    const result = await this.dao.getItems();
    return result;
  };

  /*
  getItemById = async (id) => {
    if(Number.isNaN(parseInt(id))) throw(422);
    if (id == null) throw 422;
    const items = await this.dao.getItems();
    const result = await items.filter((e) => e.id == id);
    if (result.length == 0) throw 404;
    return result[0];
  };
  */

  getItemByIdAndSupplierId = async(id, supplierId) => {
    if(Number.isNaN(parseInt(id)) || Number.isNaN(parseInt(supplierId))) throw(422);
    const items = await this.dao.getItems();
    let result = items.filter((e) => e.id == id);
    if(result.length == 0) throw 404;
    result = items.filter((e) => e.id == id && e.supplierId == supplierId);
    return result[0];
  }

  newItem = async (id, description, price, SKUId, supplierId) => {
    const skus = await this.skudao.getSkus();
    const items = await this.dao.getItems();
    const sku = skus.filter((s) => s.id == SKUId);
    console.log(skus)
    if (sku.length == 0) throw 404;
    let item = items.filter((e) => e.id == id);
    if (item.length != 0) throw 422;
    item = items.filter(
      (e) => e.supplierId == supplierId && e.SKUId == SKUId
    );
    if (item.length != 0) throw 422;
    const result = await this.dao.newItem(
      id,
      supplierId,
      description,
      price,
      SKUId
    );
    return result;
  };

  editItem = async (id, supplierId, newDescription, newPrice) => {
    if (Number.isNaN(parseInt(id)) || Number.isNaN(parseInt(supplierId))) throw 422;
    const items = await this.dao.getItems();
    const item = await items.filter((e) => e.id == id);
    if (item.length == 0) throw 404;
    const result = await this.dao.editItem(id, supplierId, newDescription, newPrice);
    return result;
  };

  deleteItem = async (id, supplierId) => {
    if (Number.isNaN(parseInt(id)) || Number.isNaN(parseInt(supplierId))) throw 422;
    const result = this.dao.deleteItem(id, supplierId);
    return result;
  };

  deleteAll = async () => {
    const result = this.dao.deleteAll();
    return result;
  };
}

module.exports = ItemService;
