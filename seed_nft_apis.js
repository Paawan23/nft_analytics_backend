const axios = require("axios");

const { connection } = require("./database");

const getSalesByContractAddressData = async (req, res) => {
  try {
    const db = await connection();

    let continuation;
    let api;

    do {
      api = await axios.request({
        method: "GET",
        url: `https://api.nftport.xyz/v0/transactions/nfts/0x23581767a106ae21c074b2276D25e5C3e136a68b?chain=ethereum&type=sale&continuation${
          continuation === undefined ? "" : "=" + continuation
        }`,
        headers: {
          accept: "application/json",
          Authorization: "8b17f986-1b9e-481b-8ece-867b1b5318e1",
        },
      });

      const ops = api.data.transactions.map((item) => ({
        updateOne: {
          filter: { transaction_hash: item.transaction_hash },
          update: { $set: { ...item } },
          upsert: true,
        },
      }));

      await db.collection("nft_charts").bulkWrite(ops, { ordered: false });

      continuation = api.data.continuation;
    } while (continuation != undefined);

    return res.status(200).json({ message: "OK" });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const getReserviorNFTSales = async (req, res) => {
  try {
    const db = await connection();

    let continuation;
    let api;

    do {
      const options = {
        method: "GET",
        url: `https://api.reservoir.tools/sales/v4?contract=0x23581767a106ae21c074b2276D25e5C3e136a68b&limit=1000${
          continuation === undefined ? "" : "&continuation=" + continuation
        }`,
        headers: {
          accept: "*/*",
          // "x-api-key": "c46cd2c5-81f2-525e-bdf3-fe0c20d1c8eb",
        },
      };
      api = await axios.request(options);

      const ops = api.data.sales.map((item) => ({
        updateOne: {
          filter: { txHash: item.txHash },
          update: { $set: { ...item } },
          upsert: true,
        },
      }));

      await db
        .collection("reserviour_nft_sales")
        .bulkWrite(ops, { ordered: false });

      continuation = api.data.continuation;
    } while (continuation != undefined);

    return res.status(200).json({ message: "OK" });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSalesByContractAddressData,
  getReserviorNFTSales,
};
