class TestResultService {
  dao;
  skuitemdao;
  testdescriptordao;

  constructor(dao, skuitemdao, testdescriptordao) {
    this.dao = dao;
    this.skuitemdao = skuitemdao;
    this.testdescriptordao = testdescriptordao;
  }

  newTableTestResult = async () => {
    const result = await this.dao.newTableTestResult();
    return result;
  };

  getTestResultsByRFID = async (rfid) => {
    if (Number.isNaN(parseInt(rfid))) throw 422;
    const skuitems = await this.skuitemdao.getSkuItems();
    const skuitem = await skuitems.filter((e) => e.RFID == rfid);
    if (skuitem.length == 0) throw 404;
    const result = await this.dao.getTestResultsByRFID(rfid);
    return result;
  };

  getTestResultByRFID_ID = async (rfid, id) => {
    if (rfid == undefined || id == undefined) throw 422;
    const skuitems = await this.skuitemdao.getSkuItems();
    const skuitem = await skuitems.filter((e) => (e.RFID = rfid));
    if (skuitem.length == 0) throw 404;
    const result = await this.dao.getSingleTestResultByRFID(rfid, id);
    if (result.length == 0) throw 404;
    return result;
  };

  newTestResult = async (rfid, idTestDescriptor, date, result) => {
    if (
      Number.isNaN(parseInt(rfid)) ||
      rfid == 0 || 
      idTestDescriptor == undefined ||
      (result != true && result != false)
    )
      throw 422;
    const skuitems = await this.skuitemdao.getSkuItems();
    const skuitem = skuitems.filter((e) => (e.RFID == rfid));
    if (skuitem.length == 0) throw 404;
    const testDescriptors = await this.testdescriptordao.getTestDescriptors();
    const testDescriptor = await testDescriptors.filter(
      (e) => e.id == idTestDescriptor
    );
    if (testDescriptor.length == 0) throw 404;
    const r = await this.dao.newTestResult(
      rfid,
      idTestDescriptor,
      date,
      result
    );
    return r;
  };

  editTestResult = async (
    rfid,
    id,
    newIdTestDescriptor,
    newDate,
    newResult
  ) => {
    if (
      Number.isNaN(parseInt(rfid))||
      id == undefined ||
      newIdTestDescriptor == undefined ||
      (newResult != true && newResult != false)
    )
      throw 422;
    const skuitems = await this.skuitemdao.getSkuItems();
    const skuitem = skuitems.filter((e) => (e.RFID == rfid));
    console.log(skuitem)
    if (skuitem.length == 0) throw 404;
    const testDescriptors = await this.testdescriptordao.getTestDescriptors();
    const testDescriptor = testDescriptors.filter((e) => (e.id == id));
    console.log(id);
    console.log(testDescriptor)
    //if (testDescriptor.length == 0) throw 404;
    const result = await this.dao.editTestResult(
      rfid,
      id,
      newIdTestDescriptor,
      newDate,
      newResult
    );
    return result;
  };

  deleteTestResult = async (rfid, id) => {
    if (rfid == undefined || id == undefined) throw 422;
    const result = await this.dao.deleteSingleTestResult(rfid, id);
    return result;
  };

  deleteAll = async () => {
    const result = await this.dao.deleteAll();
    return result;
  };
}
module.exports = TestResultService;
