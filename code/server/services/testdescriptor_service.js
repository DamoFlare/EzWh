class TestDescriptorService{
    dao;
    skudao;

    constructor(dao, skudao) {
        this.dao = dao;
        this.skudao = skudao;
    }

    newTableTestDescriptor = async() => {
        const result = await this.dao.newTableTestDescriptor();
        return result;
    }

    newTableSkuTestDescriptors = async() => {
        const result = await this.dao.newTableSkuTestDescriptors();
        return result;
    }

    getTestDescriptors = async() => {
        const result = await this.dao.getTestDescriptors();
        return result;
    }

    getTestDescriptorByID = async(id) => {
        id = parseInt(id);
        if(id == null || id == 0 || Number.isNaN(id)){
            throw(422);
        }
        const testDescriptors = await this.dao.getTestDescriptors();
        const result = testDescriptors.filter((e) => e.id == id);
        if(result.length == 0)
            throw(404);
        return result[0];
    }

    newTestDescriptor = async(name, procedureDescription, idSKU) => {
        if(idSKU == null || name == null || procedureDescription == null) throw(422);
        const skus = await this.skudao.getSkus();
        const sku = await skus.filter((e) => e.id == idSKU);
        if(sku.length == 0) throw(404);
        const result = await this.dao.newTestDescriptor(name, procedureDescription, idSKU);
        return result;
    }

    editTestDescriptor = async(newName, newProcedureDescription, newIdSKU, id) => {
        if(id == undefined || newIdSKU == undefined) throw(422);
        const testDescriptors = await this.dao.getTestDescriptors();
        const testDescriptor = await testDescriptors.filter((e) => e.id == id);
        if(testDescriptor.length == 0) throw(404);
        const skus = await this.skudao.getSkus();
        const sku = await skus.filter((e) => e.id == newIdSKU);
        if(sku.length == 0) throw(404);
        const result = await this.dao.editTestDescriptor(newName, newProcedureDescription, newIdSKU, id);
        return result;
    }

    deleteTestDescriptor = async(id) => {
        id = parseInt(id);
        if(id == null || id == 0 || Number.isNaN(id)){
            throw(422);
        }
        const result = await this.dao.deleteTestDescriptor(id);
        return result;
    }

    deleteAll = async() => {
        const result = await this.dao.deleteAll();
        return result;
    }




}

module.exports = TestDescriptorService;