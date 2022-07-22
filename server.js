const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app.js");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace("<password>", process.env.DB_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connection established"))
  .catch((err) => console.log(err.message));

app.listen(process.env.PORT, function () {
  console.log(`App started on port ${process.env.PORT}`);
});

// DB_PASSWORD=d6DV9R9r1GBOtJsD
// DATABASE=mongodb+srv://uditjain2622004:<password>@cluster0.i0jfteb.mongodb.net/?retryWrites=true&w=majority
// PORT=3000
