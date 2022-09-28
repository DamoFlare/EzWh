class SkuItemService {
    dao;
    skudao;

    constructor(dao, skudao){
        this.dao = dao;
        this.skudao = skudao;
    }

    newTableSkuItem = async() => {
        const result = await this.dao.newTableSkuItem();
        return result;
    }

    getSkuItems = async() => {
        const result = await this.dao.getSkuItems();
        return result;
    }

    getSkuItemsBySkuID = async(id) => {
        if(Number.isNaN(parseInt(id))) throw(422);
        const skuItems = await this.dao.getSkuItems();
        const result = skuItems.filter((e) => e.SKUId == id && e.Available == 1);
        if(result.length == 0) throw(404);
        return result;
    }

    getSkuItemByRFID = async(id) => {
        if(Number.isNaN(parseInt(id))) throw(422);
        if(id == null ||id == '' ||typeof id !='string'|| id == undefined ) throw(422);
        const skuItems = await this.dao.getSkuItems();
        const result = skuItems.filter((e) => e.RFID == id);
        if(result.length == 0) throw(404);
        return result[0];
    }

    newSkuItem = async(RFID, SKUId, DateOfStock) => {
        if(RFID == null|| SKUId == null) throw(422);
        const skus = await this.skudao.getSkus();
        console.log(skus)
        const sku = skus.filter((e) => e.id == SKUId);
        if(sku.length == 0) throw(404);
        const result = await this.dao.newSkuItem(RFID, SKUId, DateOfStock);
        return result;
    }

    editSkuItem = async(RFID, newRFID, newAvailable, newDateOfStock) => {
        if(RFID == null || newAvailable == null || newRFID == null ) throw(422);
        const skuItems = await this.dao.getSkuItems();
        const skuItem = skuItems.filter((e) => e.RFID == RFID);
        if(skuItem.length == 0) throw(404);
        const result = await this.dao.editSkuItem(RFID, newRFID, newAvailable, newDateOfStock);
        return result;
    }

    deleteSkuItem = async(RFID) => {
        if(RFID == undefined) throw(422);
        const result = await this.dao.deleteSkuItem(RFID);
        return result;
    }
    
    deleteAll = async() => {
        const result = await this.dao.deleteAll();
        return result;
    }


}
module.exports = SkuItemService;