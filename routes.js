const express = require("express");
const { getSales, getOwners } = require("./controllers/sales");
const {
  getReserviorNFTSales,
  getReserviorNFTOffers,
} = require("./seed_nft_apis");
const router = express.Router();

router.get("/getSales", getSales);
router.get("/getOwners", getOwners);
// router.get("/getReserviorNFTOffers", getReserviorNFTOffers);
//getReserviorNFTOffers router.get("/getReserviorNFTSales", getReserviorNFTSales);

module.exports = router;
