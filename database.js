const MongoClient = require("mongodb").MongoClient;
let cachedDb = null;

const connection = async () => {
  try {
    if (cachedDb) {
      console.log(`Mongodb Connected successfully!`);
      return cachedDb;
    } else {
      const abc = await MongoClient.connect("mongodb://127.0.0.1:27017/NFTs", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      // console.log("abc :>> ", abc);
      let db = abc.db();
      console.log(`New Database Connection`);
      cachedDb = db;
      return cachedDb;
    }
  } catch (error) {
    console.log("Connection Failed! ", error);
  }
};

module.exports = {
  connection,
};