const TestResultService = require("../services/testresult_service");
const dao = require("../modules/TestResultDAO");
const skuitemdao = require("../modules/SkuItemDAO");

const testdescriptordao = require("../modules/TestDescriptorDAO");
const testresult_service = new TestResultService(
  dao,
  skuitemdao,
  testdescriptordao
);

describe("edit test result", () => {
  beforeEach(async () => {
    await dao.deleteAll();
    await skuitemdao.deleteAll();
    await testdescriptordao.deleteAll();
  });
  afterEach(async () => {
    await dao.deleteAll();
    await skuitemdao.deleteAll();
    await testdescriptordao.deleteAll();
  });

  testEditTestResult("202222", 1, 2, "20/10/2020", false);

  async function testEditTestResult(
    rfid,
    id,
    newIdTestDescriptor,
    newDate,
    newResult
  ) {
    test("edit test result", async () => {
      try {
        //create one
        await skuitemdao.newSkuItem(rfid, 1, "date");

        //create 2 test descriptors
        await testdescriptordao.newTestDescriptor("td1", "proc1", 1);
        await testdescriptordao.newTestDescriptor("td2", "proc2", 2);

        await testresult_service.newTestResult(rfid, 1, "10/10/2020", true);

        await testresult_service.editTestResult(
          rfid,
          id,
          newIdTestDescriptor,
          newDate,
          newResult
        );

        let res = await testresult_service.getTestResultsByRFID(rfid);

        console.log(res);

        expect(res[0].id).toEqual(id);
        expect(res[0].idTestDescriptor).toEqual(newIdTestDescriptor);
        expect(res[0].Date).toEqual(newDate);
        expect(res[0].Result).toEqual(0);
      } catch (e) {
        expect(e).toEqual(404);
      }
    });
  }
});
