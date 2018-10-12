const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validation = require("./validation");

router.get("/users/sign_in", userController.signInForm);
router.get("/users/sign_out", userController.signOut);
router.get("/users/sign_up", userController.signUp);
router.get("/users/:id", userController.show);

router.post("/users", validation.validateUsers, userController.create);
router.post("/users/sign_in", validation.validateUsers, userController.signIn);

module.exports = router;
