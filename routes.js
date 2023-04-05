const express = require("express");
const {
  getSales,
  getOwners,
  getTopOwners,
  getOfferData,
} = require("./controllers/analytics");

const router = express.Router();

router.get("/getSales", getSales);
router.get("/getOwners", getOwners);
router.get("/getTopOwners", getTopOwners);
router.get("/getOfferData", getOfferData);

module.exports = router;
