require("dotenv").config();
const axios = require("axios");
const Stock = require("../models/Stock");

// Base URL for Finnhub API
const FINNHUB_BASE = "https://finnhub.io/api/v1";

module.exports = {
  getStocks: async (req, res) => {
    const symbol = req.query.symbol || "AAPL";
    const token = process.env.API_KEY;

    if (!token) {
      console.error("No API_KEY provided in environment");
      return res.status(500).json({ error: "API key missing" });
    }

    try {
      // Example: symbol search endpoint
      const url = `${FINNHUB_BASE}/search`;
      const response = await axios.get(url, {
        params: {
          q: symbol,
          token: token,
        },
      });

      return res.json(response.data);
    } catch (error) {
      console.error(
        "Error calling Finnhub:",
        error.response?.data || error.message
      );
      return res.status(500).json({ error: "Failed to fetch from Finnhub" });
    }
  },

  getQuote: async (req, res) => {
    const symbol = req.query.symbol;
    const token = process.env.API_KEY;

    if (!symbol) {
      return res.status(400).json({ error: "symbol query param is required" });
    }
    if (!token) {
      return res.status(500).json({ error: "API key missing" });
    }

    try {
      const url = `${FINNHUB_BASE}/quote`;
      const response = await axios.get(url, {
        params: {
          symbol: symbol,
          token: token,
        },
      });

      return res.json(response.data);
    } catch (error) {
      console.error(
        "Error fetching quote:",
        error.response?.data || error.message
      );
      return res.status(500).json({ error: "Failed to fetch quote" });
    }
  },

  // Add more controller functions here
  getStockData: async (req, res) => {
    const { symbol } = req.params;
    const token = process.env.API_KEY;

    if (!symbol) {
      return res.status(400).json({ error: "symbol query param is required" });
    }
    if (!token) {
      return res.status(500).json({ error: "API key missing" });
    }

    try {
      // 1️⃣ Check if stock exists in MongoDB
      let stock = await Stock.findOne({ symbol });

      if (stock) {
        console.log(`✅ Found ${symbol} in DB`);
        return res.json(stock);
      }

      // 2️⃣ Not found → fetch from API
      const url = `${FINNHUB_BASE}/quote`;
      const response = await axios.get(url, {
        params: {
          symbol: symbol,
          token: token,
        },
      });

      const data = response.data;

      // 3️⃣ Validate API response
      if (!data || !data.c) {
        return res.status(404).json({ message: "No data from API" });
      }

      // 4️⃣ Save to DB
      stock = new Stock({
        symbol,
        price: data.c,
        volume: data.v,
        timestamp: new Date(),
      });

      await stock.save();
      console.log(`✅ ${symbol} saved to DB`);

      // 5️⃣ Return the newly fetched data
      res.json(stock);
    } catch (error) {
      console.error(`❌ Error fetching stock ${symbol}:`, error.message);
      res.status(500).json({ message: "Server Error" });
    }
  },
};
