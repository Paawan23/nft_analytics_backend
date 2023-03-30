const express = require("express");
const { getSales } = require("./controllers/sales");
const { getReserviorNFTSales } = require("./seed_nft_apis");
const router = express.Router();

router.get("/getSales", getSales);
// router.get("/getReserviorNFTSales", getReserviorNFTSales);

module.exports = router;
