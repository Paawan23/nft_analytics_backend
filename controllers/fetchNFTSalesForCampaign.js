const { connection } = require("../database");

const fetch = (url, init) =>
  import("node-fetch").then(({ default: fetch }) => fetch(url, init));

/** To get previous dates based on given hours  */
const subtractTimeFromDate = (objDate, intHours) => {
  const numberOfMlSeconds = objDate.getTime();
  const addMlSeconds = intHours * 60 * 60 * 1000;
  const newDateObj = new Date(numberOfMlSeconds - addMlSeconds);
  return newDateObj.toLocaleDateString();
};

/** get USD price of CRO coin */
const croExchangeToUSD = async () => {
  try {
    const api = await fetch(
      `https://api.crypto.com/v2/public/get-ticker?instrument_name=CRO_USD`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }
    );

    const data = await api.json();
    const rate = Number(data.result.data[0].a);
    return rate;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

/** Moralis api to get cronos nft data of last 2 days */
const fetchNftSalesForCampaign = async () => {
  try {
    const db = await connection();
    let cursor;
    const lastDate = await subtractTimeFromDate(
      new Date(),
      240 /** LAST 10 DAYS */
    );
    let usdRate = await croExchangeToUSD();
    do {
      const api = await fetch(
        `https://deep-index.moralis.io/api/v2/nft/0x5DA0c6A68e7C348664664F1546B9BaAA493E8C73/transfers?chain=cronos&from_date=${lastDate
          .split("/")
          .reverse()
          .join("/")}&to_date=${new Date()
          .toLocaleDateString()
          .split("/")
          .reverse()
          .join("/")}${cursor === undefined ? "" : "&cursor=" + cursor}`,
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
          filter: {
            transaction_hash: item.transaction_hash,
            token_id: item.token_id,
          },
          update: {
            $set: {
              block_number: item.block_number,
              transaction_hash: item.transaction_hash,
              price: Number(item.value),
              price_usd:
                Number(item.value) === 0
                  ? Number(item.value)
                  : Number(item.value) * Math.pow(10, -18) * usdRate,
              contract_type: item.contract_type,
              token_address: item.token_address,
              token_id: item.token_id,
              seller_address: item.from_address,
              buyer_address: item.to_address,
              quantity: Number(item.amount),
              block_hash: item.block_hash,
              created_at: new Date(item.block_timestamp),
            },
            $setOnInsert: {
              reward_id: null,
            },
          },
          upsert: true,
        },
      }));

      /** UPSERT DATA INTO THE COLLECTION */
      await db.collection("sales").bulkWrite(ops, { ordered: false });

      cursor = data.cursor;
      console.log("🚀", cursor);
    } while (cursor != undefined || cursor != null);
  } catch (error) {
    throw new Error(error.message);
  }
};

fetchNftSalesForCampaign();

module.exports = {
  fetchNftSalesForCampaign,
};
