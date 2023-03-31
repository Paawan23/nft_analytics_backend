const express = require("express");
const {
  getSales,
  getOwners,
  getTopOwners,
  getOfferData,
} = require("./controllers/sales");
const {
  getReserviorNFTSales,
  getReserviorNFTOffers,
  getReserviorTop100Owners,
} = require("./seed_nft_apis");
const router = express.Router();

router.get("/getSales", getSales);
router.get("/getOwners", getOwners);
router.get("/getTopOwners", getTopOwners);
router.get("/getOfferData", getOfferData);
// router.get("/getReserviorTop100Owners", getReserviorTop100Owners);
router.get("/getReserviorNFTOffers", getReserviorNFTOffers);

module.exports = router;
