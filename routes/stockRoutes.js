const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");

router.get("/stocks", stockController.getStocks);
router.get("/quote", stockController.getQuote);
router.get("/all-stocks/:symbol", stockController.getStockData);

module.exports = router;

// Example URLs:
// http://localhost:9000/api/stocks?symbol=MSFT
// http://localhost:9000/api/quote?symbol=TSLA
// http://localhost:9000/api/all-stocks/AAPL
