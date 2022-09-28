const ValidateLogin = require("../modules/ValidateLogin");

testValidateLogin(["manager"], true);
testValidateLogin(["supplier"], false);

function testValidateLogin(role, expectedResult) {
  test("test validation", () => {
    vl = new ValidateLogin();
    expect(vl.validateLogin(role)).toStrictEqual(expectedResult);
  });
}
