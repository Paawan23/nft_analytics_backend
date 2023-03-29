const { connection } = require("../database");

const getSales = async (req, res) => {
  try {
    const db = await connection();
    const getData = await db
      .collection("nft_charts")
      .find({ transaction_date: { $gt: new ISODate("2023-03-26T04:00:35Z") } })
      .toArray();

    console.log("getData :>> ", getData);
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
