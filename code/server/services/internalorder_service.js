class InternalOrderService{
    dao;

    constructor(dao){
        this.dao = dao;
    }

    getInternalOrders = async() => {
        const internalOrders = await this.dao.getInternalOrders();
        return internalOrders;
    }

    getInternalOrdersIssued = async() => {
        const internalOrders = await this.dao.getInternalOrders();
        const result = await internalOrders.filter((e) => e.state == 'ISSUED');
        return result;
    }

    getInternalOrdersAccepted = async() => {
        const internalOrders = await this.dao.getInternalOrders();
        const result = await internalOrders.filter((e) => e.state == 'ACCEPTED');
        return result;
    }

    getInternalOrdersById = async(id) => {
        if(id == undefined)
            throw(422);
        const internalOrders = await this.dao.getInternalOrders();
        const result = await internalOrders.filter((e) => e.id == id);
        if(result.length == 0)
            throw(404);
        return result;
    }

    newTableInternalOrder = async() => {
        const result = await this.dao.newTableInternalOrder();
        return result;
    }

    newTableProducts = async() => {
        const result = await this.dao.newTableProducts();
        return result;
    }

    newInternalOrder = async(issueDate, customerId, products) => {
        if(issueDate == undefined || customerId == undefined){
            throw(422);
        }
        /* importare oggetto user per fare controllo se in user table
            c'è customerId */
        const result = await this.dao.newInternalOrder(issueDate, customerId, products);
        return result;
    }

    editInternalOrder = async(id, newState, products) => {
        if(id == undefined || newState == undefined)
            throw(422);
        if(newState == "COMPLETED" && products == undefined) throw(422);
        const internalOrders = await this.dao.getInternalOrders();
        let result = internalOrders.filter((e) => e.id == id);
        if(result.length == 0)
            throw (404);
        result = this.dao.editInternalOrder(id, newState, products);
        return result;
    }

    deleteInternalOrder = async(id) => {
        if(id == undefined)
            throw(422);
        const result = await this.dao.deleteInternalOrder(id);
        return result;

    }

    deleteAll = async() => {
        const result = await this.dao.deleteAll();
        return result;
    }
}

module.exports = InternalOrderService;
