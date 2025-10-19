const express = require("express");
const connectDB = require("./db"); // 👈 correct path
require("dotenv").config();
const Stock = require("./models/Stock");

const cors = require("cors");

connectDB();

const stockRoutes = require("./routes/stockRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use("/api", stockRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
