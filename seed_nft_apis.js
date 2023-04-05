const axios = require("axios");

const { connection } = require("./database");

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
const getReserviorNFTOffers = async () => {
  try {
    const db = await connection();

    let continuation;
    let api;

    do {
      const options = {
        method: "GET",
        url: `https://api.reservoir.tools/orders/bids/v5?collection=0x23581767a106ae21c074b2276D25e5C3e136a68b&limit=1000${
          continuation === undefined ? "" : "&continuation=" + continuation
        }`,
        headers: {
          accept: "*/*",
          "x-api-key": "c46cd2c5-81f2-525e-bdf3-fe0c20d1c8eb",
        },
      };
      api = await axios.request(options);

      const ops = api.data.orders.map((item) => ({
        updateOne: {
          filter: { id: item.id },
          update: { $set: { ...item } },
          upsert: true,
        },
      }));

      await db
        .collection("reserviour_nft_offers")
        .bulkWrite(ops, { ordered: false });

      continuation = api.data.continuation;
    } while (continuation != undefined);

    // await db.collection("reserviour_nft_owners").insertMany(owners);

    return { message: "OK" };
  } catch (error) {
    console.log("error.message :>> ", error.message);
  }
};

const getReserviorTop100Owners = async (req, res) => {
  try {
    const db = await connection();

    let api;

    const options = {
      method: "GET",
      url: `https://api.reservoir.tools/owners/v2?collection=0x23581767a106ae21c074b2276D25e5C3e136a68b&limit=100`,
      headers: {
        accept: "*/*",
        "x-api-key": "c46cd2c5-81f2-525e-bdf3-fe0c20d1c8eb",
      },
    };
    api = await axios.request(options);

    const ops = api.data.owners.map((item) => ({
      updateOne: {
        filter: { address: item.address },
        update: { $set: { ...item } },
        upsert: true,
      },
    }));

    await db
      .collection("reserviour_nft_top_owners")
      .bulkWrite(ops, { ordered: false });

    // await db.collection("reserviour_nft_top_owners").insertMany(owners);

    return res.status(200).json({ message: "OK" });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const getCronosSalesByContractAddressData = async (req, res) => {
  try {
    const db = await connection();

    let cursor;
    let api;

    do {
      api = await axios.request({
        method: "GET",
        url: `https://deep-index.moralis.io/api/v2/nft/0x5DA0c6A68e7C348664664F1546B9BaAA493E8C73/transfers?chain=cronos${
          cursor === undefined ? "" : "&cursor=" + cursor
        }`,
        headers: {
          accept: "application/json",
          "x-api-key":
            "Jts6VzYtgtPxxHmNPrWhjgXSUgfDATmu6jUpJtZ0jzaxGwTV4my5olGa7eGIhx98",
        },
      });

      // const ops = api.data.result.map((item) => ({
      //   updateOne: {
      //     filter: { token_hash: item.token_hash },
      //     update: { $set: { ...item } },
      //     upsert: true,
      //   },
      // }));

      // await db
      //   .collection("nft_cronos_sales")
      //   .bulkWrite(ops, { ordered: false });

      await db.collection("nft_cronos_sales").insertMany(api.data.result);

      cursor = api.data.cursor;
      console.log("cursor :>> ", cursor);
    } while (cursor != undefined || cursor != null);

    return res.status(200).json({ message: "OK" });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getReserviorNFTSales,
  getReserviorNFTOffers,
  getReserviorTop100Owners,
  getCronosSalesByContractAddressData,
};
