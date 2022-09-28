var express = require("express");
var router = express.Router();
var UserService = require("../services/user_service");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

const dao = require("../modules/UserDAO");
var user = new UserService(dao);

const salt = 10;

//GET /api/userinfo
router.get("/userinfo", async (req, res) => {
  try {
    const result = await user.getUserInfo();
    res.status(200).json(result).end();
  } catch (error) {
    return res.status(500).json(error).end();
  }
});

//GET /api/suppliers
router.get("/suppliers", async (req, res) => {
  try {
    const result = await user.getSuppliers();
    return res.status(200).json(result).end();
  } catch (error) {
    return res.status(500).json(error).end();
  }
});

//GET /api/users
router.get("/users", async (req, res) => {
  try {
    const result = await user.getUsers();
    return res.status(200).json(result).end();
  } catch (error) {
    return res.status(500).json(error).end();
  }
});

//POST /api/newUser
router.post("/newUser", [body("username").isEmail()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    await user.newTableUser();
    await user.newUser(
      req.body.username,
      hashedPassword,
      req.body.type,
      req.body.name,
      req.body.surname
    );
    return res.status(201).json("Created").end();
  } catch (error) {
    if (error == 422)
      return res
        .status(422)
        .json(
          "Validation of request body failed of attempt to create manager or administrator accounts"
        )
        .end();
    return res.status(503).json(error).end();
  }
});

//POST /api/managerSessions
router.post(
  "/managerSessions",
  [body("username").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const result = await user.login(req.body.username, req.body.password);
      return res.status(201).json(result).end();
    } catch (error) {
      if (error === "Invalid username")
        return res.status(401).json("Invalid username").end();
      else if (error === "Invalid password")
        return res.status(401).json("Invalid password").end();
      else return res.status(500).json("Generic error").end();
    }
  }
);

//POST /api/customerSessions
router.post(
  "/customerSessions",
  [
    body("username").isEmail(), // username must be an email
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const result = await user.login(username, password);
      return res.status(201).json(result).end();
    } catch (error) {
      if (error === "Invalid username")
        return res.status(401).json("Invalid username").end();
      else if (error === "Invalid password")
        return res.status(401).json("Invalid password").end();
      else return res.status(500).json("Generic error").end();
    }
  }
);

//POST /api/supplierSessions
router.post(
  "/supplierSessions",
  [
    body("username").isEmail(), // username must be an email
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const result = await user.login(username, password);
      return res.status(201).json(result).end();
    } catch (error) {
      if (error === "Invalid username")
        return res.status(401).json("Invalid username").end();
      else if (error === "Invalid password")
        return res.status(401).json("Invalid password").end();
      else return res.status(500).json("Generic error").end();
    }
  }
);

//POST /api/clerkSessions
router.post(
  "/clerkSessions",
  [
    body("username").isEmail(), // username must be an email
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const result = await user.login(req.body.username, req.body.password);
      return res.status(201).json(result).end();
    } catch (error) {
      if (error === "Invalid username")
        return res.status(401).json("Invalid username").end();
      else if (error === "Invalid password")
        return res.status(401).json("Invalid password").end();
      else return res.status(500).json("Generic error").end();
    }
  }
);

//POST /api/qualityEmployeeSessions
router.post(
  "/qualityEmployeeSessions",
  [
    body("username").isEmail(), // username must be an email
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const result = await user.login(username, password);
      return res.status(201).json(result).end();
    } catch (error) {
      if (error === "Invalid username")
        return res.status(401).json("Invalid username").end();
      else if (error === "Invalid password")
        return res.status(401).json("Invalid password").end();
      else return res.status(500).json("Generic error").end();
    }
  }
);

//POST /api/deliveryEmployeeSessions
router.post(
  "/deliveryEmployeeSessions",
  [
    body("username").isEmail(), // username must be an email
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const result = await user.login(username, password);
      return res.status(201).json(result).end();
    } catch (error) {
      if (error === "Invalid username")
        return res.status(401).json("Invalid username").end();
      else if (error === "Invalid password")
        return res.status(401).json("Invalid password").end();
      else return res.status(500).json("Generic error").end();
    }
  }
);

//PUT /api/users/:username
router.put("/users/:username", async (req, res) => {
  try {
    const result = await user.modRights(
      req.body.newType,
      req.params.username,
      req.body.oldType
    );
    return res.status(200).json("Success").end();
  } catch (error) {
    if (error === 404) return res.status(404).json("invalid").end();
    if(error == 422) return res.status(422).end();
    else return res.status(500).json("Generic error").end();
  }
});

//DELETE /api/users/:username/:type

router.delete("/users/:username/:type", async (req, res) => {
  try {
    /*
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    */
    const result = await user.cancel(req.params.username, req.params.type);
    return res.status(204).json("Success").end();
  } catch (error) {
    if(error == 422) return res.status(422).end();
    return res.status(500).json("Generic error").end();
  }
});

router.delete("/users/allUsers", async(req, res) => {
  try {
    await user.deleteAll();
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json("").end();
  }
})

module.exports = router;
