class SkuService{
    dao;
    positiondao;

    constructor(dao, positiondao){
        this.dao = dao;
        this.positiondao = positiondao;
    }

    newTableSku = async() => {
        const result = await this.dao.newTableSku();
        return result;
    }

    newTableSkuTestDescriptors = async() => {
        const result = await this.dao.newTableSkuTestDescriptors();
        return result;
    }

    getSkus = async() => {
        const result = await this.dao.getSkus();
        return result;
    }

    getSkusById = async(id) => {
        
        if(id == 0 || Number.isNaN(parseInt(id)))
            throw(422);
        const skus = await this.dao.getSkus();
        const sku = await skus.filter((s) => s.id == id);
        if(sku.length == 0)
            throw(404);
        return sku;
    }

    newSku = async(description, weight, volume, notes, price, availableQuantity) => {
        if(description =='' || typeof description != 'string')
            throw(422);
        if(notes =='' || typeof notes != 'string')
            throw(422);
        if ( typeof weight != 'number' ||  weight <=0)
            throw(422);
        if (  typeof volume != 'number' ||volume <=0)
            throw(422);
        if (typeof price != 'number' || price <=0)
            throw(422);
        if (!Number.isInteger(availableQuantity) || availableQuantity<=0)
            throw(422);
        const result = await this.dao.newSku(description, weight, volume, notes, price, availableQuantity);
        return result;
    }

    editSku = async(id, newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity) => {
        if(id == 0 || Number.isNaN(parseInt(id))) throw(422);
        const skus = await this.dao.getSkus();
        const sku = await skus.filter((s) => s.id == id);
        if(sku.length == 0)
            throw(404);
        const positionId = await sku[0].position;
        const positions = await this.positiondao.getPositions();
        const position = await positions.filter((p) => p.positionID == positionId);
        console.log(positionId != null && positionId != undefined)
        console.log(typeof positionId)
        if(positionId != null && positionId != undefined){
            if(newAvailableQuantity * newWeight > position[0].maxWeight || newAvailableQuantity * newVolume > position[0].maxVolume)
                throw(422);
        }
        const result = await this.dao.editSku(id, newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity, positionId == undefined ? 0 : positionId);
        return result;
    }

    editSkuPosition = async(id, positionId) => {
        if(id == null || id == 0 || typeof id != 'number'|| id == undefined)
            throw(422);
        if(positionId == null || positionId == 0 || typeof positionId != 'number'|| positionId == undefined)
            throw(422);
        const skus = await this.dao.getSkus();
        const sku = skus.filter((s) => s.id == id);
        if(sku.length == 0)
            throw(404);
        const positions = await this.positiondao.getPositions();
        const position = await positions.filter((p) => p.positionID == positionId);
        if(position.length == 0)
            throw(404);
        const newWeight = sku[0].weight * sku[0].availableQuantity;
        const newVol = sku[0].volume * sku[0].availableQuantity;   
        if(newWeight > position[0].maxWeight || newVol > position[0].maxVolume)
            throw(422);
        const repeatedSku = skus.filter((s) => s.position == positionId);
        if(repeatedSku.length != 0)
            throw(422);
        const result = await this.dao.editSkuPosition(positionId, id, newWeight, newVol);
        return result;
    }

    deleteSku = async(id) => {
        if(id == undefined)
            throw(422);
        const skus = await this.dao.getSkus();
        const sku = skus.filter((s) => s.id == id);
        const positionId = sku.position;
        const result = await this.dao.deleteSkuByID(id, positionId);
        return result;    
    }

    deleteAll = async() => {
        const result = await this.dao.deleteAll();
        return result;
    }
}

module.exports = SkuService;