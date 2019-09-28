const faker = require("faker");
const { createUser } = require("./gateway");

const WEB_APP_HOST = process.env.WEB_APP_HOST || "http://localhost:3000";

describe("with valid user credentials", () => {
  let email;
  let name;
  let password;

  beforeEach(async () => {
    name = faker.name.findName();
    email = faker.internet.email();
    password = faker.internet.password();
    await createUser({
      email,
      name,
      password
    });
  });

  describe("when navigating to the login page", () => {
    beforeEach(async () => {
      await page.goto(`${WEB_APP_HOST}/#/login`);
    });

    describe("when form is submitted", () => {
      beforeEach(async () => {
        await expect(page).toFill("#username", email);
        await expect(page).toFill("#password", password);
        await expect(page).toClick("button", { text: "Sign in" });
      });

      it("should redirect to /", async () => {
        expect(await page.url()).toEqual(`${WEB_APP_HOST}/`);
      });
    });
  });
});
