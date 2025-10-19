const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, unique: true },
    name: String,
    price: Number,
    volume: Number,
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "stocks-list" }
);
// 👈 explicitly set the collection name

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
