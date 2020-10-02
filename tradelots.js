const Random = require("random-js").Random;
const rng = new Random();
const tradeGoods = require('./data/tradegoods');

function intersect(a, b) {
  var setB = new Set(b);
  return [...new Set(a)].filter(x => setB.has(x));
}

function tradeLots(tradeCodes) {
  let lots = [];
  for (const index in tradeGoods) {
    if (tradeGoods[index].availability.length === 0 || intersect(tradeCodes, tradeGoods[index].availability).length > 0) {
      lots.push(tradeGoods[index]);
    }
  }

  // plus up to 6 random lots
  for (let i=0; i < rng.die(6); i++) {
    let index = rng.die(5)*10+rng.die(6);
    index = index.toString();
    lots.push(tradeGoods[index]);
  }

  return lots;
}

module.exports = tradeLots;
