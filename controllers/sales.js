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
      .find({
        timestamp: { $gt: Number(d) },
      })
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
};
