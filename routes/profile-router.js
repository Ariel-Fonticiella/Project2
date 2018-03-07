const express = require("express");

const UserModel = require("../models/user-model");
const JudgeModel = require("../models/judge-model");

const router = express.Router();


router.get("/profile", (req, res, next) => {
  res.render("user-views/profile-page");
});



module.exports = router;
