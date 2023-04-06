const { ObjectId } = require("mongodb");
const { connection } = require("../database");

const processNftSalesCampaignRewards = async () => {
  try {
    const db = await connection();

    const getSaleData = await db
      .collection("sales")
      .find({ reward_id: null })
      .toArray();

    /** inserting rewards collection data */
    const ops = getSaleData.map((item) => ({
      updateOne: {
        filter: {
          sale_id: new ObjectId(item._id),
        },
        update: {
          $set: {
            sale_id: new ObjectId(item._id),
            sale_seller: item.seller_address,
            sale_buyer: item.buyer_address,
            transaction_hash: item.transaction_hash,
            transaction_amount: item.price,
            transaction_amount_usd: item.price_usd,
            transaction_amount_token: item.token_id,
            transaction_time: item.created_at,
            reward_amount: item.price_usd * 0.01,
            created_at: new Date(),
          },
        },
        upsert: true,
      },
    }));
    /** UPSERT DATA INTO THE COLLECTION */
    await db.collection("rewards").bulkWrite(ops, { ordered: false });

    getSaleData.map(async (item) => {
      const reward = await db
        .collection("rewards")
        .find({ sale_id: item._id })
        .toArray();

      await db
        .collection("sales")
        .updateOne(
          { _id: item._id },
          { $set: { reward_id: reward[0]._id } },
          { upsert: true }
        );
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

processNftSalesCampaignRewards();
