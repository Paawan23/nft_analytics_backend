const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = require("./routes");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use("/", router);

app.listen(5000, () => {
  console.log(`App listening to the port ${5000}`);
});
