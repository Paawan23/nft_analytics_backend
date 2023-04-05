const { connection } = require("../database");

// import fetch from "node-fetch";

const fetch = (url, init) =>
  import("node-fetch").then(({ default: fetch }) => fetch(url, init));

const subtractTimeFromDate = (objDate, intHours) => {
  const numberOfMlSeconds = objDate.getTime();
  const addMlSeconds = intHours * 60 * 60 * 1000;
  const newDateObj = new Date(numberOfMlSeconds - addMlSeconds);

  return newDateObj.toLocaleDateString();
};

subtractTimeFromDate(new Date(), 48);

const fetchNftSalesForCampaign = async () => {
  try {
    const db = await connection();
    let cursor;
    const lastDate = await subtractTimeFromDate(new Date(), 48); // data between NOW and last 2 days
    do {
      const api = await fetch(
        `https://deep-index.moralis.io/api/v2/nft/0x5DA0c6A68e7C348664664F1546B9BaAA493E8C73/transfers?chain=cronos&from_date=${lastDate}&to_date=${new Date().toLocaleDateString()}${
          cursor === undefined ? "" : "&cursor=" + cursor
        }`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "x-api-key":
              "Jts6VzYtgtPxxHmNPrWhjgXSUgfDATmu6jUpJtZ0jzaxGwTV4my5olGa7eGIhx98",
          },
        }
      );

      const data = await api.json();

      const ops = data.result.map((item) => ({
        updateOne: {
          filter: { transaction_hash: item.transaction_hash },
          update: {
            $set: {
              block_number: item.block_number,
              transaction_hash: item.transaction_hash,
              price: Number(item.value),
              contract_type: item.contract_type,
              token_address: item.token_address,
              token_id: item.token_id,
              seller_address: item.from_address,
              buyer_address: item.to_address,
              quantity: Number(item.amount),
              block_hash: item.block_hash,
              created_at: new Date(item.block_timestamp),
            },
            $setOnInsert: { reward_id: null },
          },
          upsert: true,
        },
      }));

      await db.collection("sales").bulkWrite(ops, { ordered: false });

      cursor = data.cursor;
      console.log("🚀", cursor);
    } while (cursor != undefined || cursor != null);
  } catch (error) {
    return { message: error.message };
  }
};

module.exports = {
  fetchNftSalesForCampaign,
};

fetchNftSalesForCampaign();
