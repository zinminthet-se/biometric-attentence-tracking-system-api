const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({
  path: `${__dirname}/config.env`,
});

const HOST = process.env.HOST;
const PORT = process.env.PORT;
const DATABASE = process.env.DB;

mongoose
  .connect(DATABASE)
  .then((con) => console.log("DB connected"))
  .catch((error) => console.log(error));

app.listen(PORT, () => {
  console.log("API is launched");
  console.log(`http://${HOST}:${PORT}`);
});
