const express = require("express");

const UserModel = require("../models/user-model");

const router = express.Router();


router.get("/documents", (req, res, next) => {
  res.render("documents-views/documents-page");
});


module.exports = router;
