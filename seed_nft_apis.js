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
const getReserviorNFTOffers = async (req, res) => {
  try {
    const db = await connection();

    let continuation;
    let api;

    // do {
    //   const options = {
    //     method: "GET",
    //     url: `https://api.reservoir.tools/orders/bids/v5?collection=0x23581767a106ae21c074b2276D25e5C3e136a68b&limit=1000${
    //       continuation === undefined ? "" : "&continuation=" + continuation
    //     }`,
    //     headers: {
    //       accept: "*/*",
    //       "x-api-key": "c46cd2c5-81f2-525e-bdf3-fe0c20d1c8eb",
    //     },
    //   };
    //   api = await axios.request(options);

    //   const ops = api.data.orders.map((item) => ({
    //     updateOne: {
    //       filter: { id: item.id },
    //       update: { $set: { ...item } },
    //       upsert: true,
    //     },
    //   }));

    //   await db
    //     .collection("reserviour_nft_offers")
    //     .bulkWrite(ops, { ordered: false });

    //   continuation = api.data.continuation;
    // } while (continuation != undefined);

    const owners = [
      {
        tokenCount: 1,
        ownerCount: 5006,
      },
      {
        tokenCount: 2,
        ownerCount: 889,
      },
      {
        tokenCount: 3,
        ownerCount: 253,
      },
      {
        tokenCount: 4,
        ownerCount: 118,
      },
      {
        tokenCount: 5,
        ownerCount: 60,
      },
      {
        tokenCount: 6,
        ownerCount: 39,
      },
      {
        tokenCount: 7,
        ownerCount: 27,
      },
      {
        tokenCount: 8,
        ownerCount: 9,
      },
      {
        tokenCount: 9,
        ownerCount: 11,
      },
      {
        tokenCount: 10,
        ownerCount: 8,
      },
      {
        tokenCount: 11,
        ownerCount: 5,
      },
      {
        tokenCount: 12,
        ownerCount: 5,
      },
      {
        tokenCount: 13,
        ownerCount: 4,
      },
      {
        tokenCount: 14,
        ownerCount: 2,
      },
      {
        tokenCount: 15,
        ownerCount: 3,
      },
      {
        tokenCount: 16,
        ownerCount: 1,
      },
      {
        tokenCount: 17,
        ownerCount: 1,
      },
      {
        tokenCount: 18,
        ownerCount: 1,
      },
      {
        tokenCount: 19,
        ownerCount: 3,
      },
      {
        tokenCount: 20,
        ownerCount: 3,
      },
      {
        tokenCount: 21,
        ownerCount: 2,
      },
      {
        tokenCount: 22,
        ownerCount: 2,
      },
      {
        tokenCount: 24,
        ownerCount: 3,
      },
      {
        tokenCount: 25,
        ownerCount: 1,
      },
      {
        tokenCount: 26,
        ownerCount: 1,
      },
      {
        tokenCount: 28,
        ownerCount: 1,
      },
      {
        tokenCount: 30,
        ownerCount: 1,
      },
      {
        tokenCount: 34,
        ownerCount: 1,
      },
      {
        tokenCount: 36,
        ownerCount: 1,
      },
      {
        tokenCount: 37,
        ownerCount: 1,
      },
      {
        tokenCount: 39,
        ownerCount: 1,
      },
      {
        tokenCount: 47,
        ownerCount: 1,
      },
      {
        tokenCount: 49,
        ownerCount: 1,
      },
      {
        tokenCount: 94,
        ownerCount: 1,
      },
    ];

    await db.collection("reserviour_nft_owners").insertMany(owners);

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
  getReserviorNFTOffers,
};
