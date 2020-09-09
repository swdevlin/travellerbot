const fs = require('fs');

const tradeCodes = JSON.parse(fs.readFileSync('data/trade_codes.json', 'utf8'));
const purchase = tradeCodes.purchase;
const sell = tradeCodes.sell;

module.exports.tradeCodes = tradeCodes;
module.exports.purchase = purchase;
module.exports.sell = sell;
