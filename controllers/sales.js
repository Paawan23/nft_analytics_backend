const { connection } = require("../database");

const getSales = async (req, res) => {
  try {
    if (req.query?.time <= 0) {
      return res.status(409).json({
        message: "Invalid time passed",
      });
    }
    let d = new Date();
    d.setDate(d.getDate() - Number(req.query.time));
    d = d.getTime().toString();
    d = d.substring(0, d.length - 3);
    const db = await connection();

    const getData = await db
      .collection("reserviour_nft_sales")
      .find({ timestamp: { $gt: Number(d) } })
      .project({
        "price.amount.decimal": 1,
        "token.tokenId": 1,
        _id: 0,
        timestamp: 1,
      })
      .sort({ "price.amount.decimal": -1 })
      .toArray();

    const getMinPrice = await db
      .collection("reserviour_nft_sales")
      .find({ timestamp: { $gt: Number(d) } })
      .sort({ "price.amount.decimal": 1 })
      .limit(1)
      .toArray();

    if (getData.length === 0) {
      return res.status(409).json({
        message: "No data found",
      });
    }

    return res.status(200).json({
      data: {
        minPrice: getMinPrice[0].price.amount.decimal,
        maxPrice: getData[0].price.amount.decimal,
        allData: getData,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const getOwners = async (req, res) => {
  try {
    const db = await connection();

    const getData = await db
      .collection("reserviour_nft_owners")
      .find({ tokenCount: 1 })
      .toArray();

    const getFirstData = await db
      .collection("reserviour_nft_owners")
      .aggregate([
        {
          $match: {
            tokenCount: {
              $gte: 2,
              $lte: 3,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$ownerCount",
            },
          },
        },
      ])
      .toArray();

    const getSecondData = await db
      .collection("reserviour_nft_owners")
      .aggregate([
        {
          $match: {
            tokenCount: {
              $gte: 4,
              $lte: 10,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$ownerCount",
            },
          },
        },
      ])
      .toArray();

    const getThirdData = await db
      .collection("reserviour_nft_owners")
      .aggregate([
        {
          $match: {
            tokenCount: {
              $gte: 11,
              $lte: 25,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$ownerCount",
            },
          },
        },
      ])
      .toArray();

    const getFourthData = await db
      .collection("reserviour_nft_owners")
      .aggregate([
        {
          $match: {
            tokenCount: {
              $gte: 26,
              $lte: 50,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$ownerCount",
            },
          },
        },
      ])
      .toArray();

    const getFifthData = await db
      .collection("reserviour_nft_owners")
      .aggregate([
        {
          $match: {
            tokenCount: {
              $gte: 51,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$ownerCount",
            },
          },
        },
      ])
      .toArray();

    return res.status(200).json({
      data: {
        oneItem: getData[0].ownerCount,
        secondThirdItem: getFirstData[0].total,
        fourTenthItem: getSecondData[0].total,
        elevenTwentyFifthItem: getThirdData[0].total,
        twentySixFiftyItem: getFourthData[0].total,
        fiftyOnePlusItem: getFifthData[0].total,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const getTopOwners = async (req, res) => {
  try {
    const db = await connection();

    const getData = await db
      .collection("reserviour_nft_top_owners")
      .find({})
      .project({ address: 1, "ownership.tokenCount": 1, _id: 0 })
      .toArray();

    if (getData.length === 0) {
      return res.status(409).json({
        message: "No data found",
      });
    }

    return res.status(200).json({
      data: getData,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const getOfferData = async (req, res) => {
  try {
    if (!req.query?.start || !req.query?.end) {
      return res.status(409).json({
        message: "Range parameters not found",
      });
    }
    const db = await connection();
    const getData = await db
      .collection("reserviour_nft_offers")
      .aggregate([
        {
          $group: {
            _id: "$price.amount.decimal",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $match: {
            _id: {
              $gte: Number(req.query?.start),
              $lte: Number(req.query?.end),
            },
          },
        },
        {
          $count: "count",
        },
      ])
      .toArray();

    if (getData.length === 0) {
      return res.status(409).json({
        message: "No data found",
      });
    }

    return res.status(200).json({
      data: getData,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSales,
  getOwners,
  getTopOwners,
  getOfferData,
};
