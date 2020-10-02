const TradeBase = require("./basetrade");
const tradeLots = require('../tradelots');
const Random = require("random-js").Random;
const rng = new Random();

const {purchase, sell} = require("../trade_codes");

class Speculation extends TradeBase {
  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  async do() {
    await super.do();
    const formatter = new Intl.NumberFormat('en-US', {useGrouping: true});
    let response = '\n**Speculation Goods**\n';
    if (this.codes.length > 1 || (this.codes.length === 1 && this.codes[0] !== '')) {
      if (this.codesAreValid(this.codes)) {
        for (let i=0; i < this.codes.length; i++)
          this.codes[i] = this.toTitleCase(this.codes[i]);

        const lots = tradeLots(this.codes);
        for (const lot of lots) {
          let purchaseDM = 0;
          let sellDM = 0;
          for (const tradeCode of this.codes) {
            if (lot.purchaseDM[tradeCode])
              purchaseDM = Math.max(purchaseDM, lot.purchaseDM[tradeCode]);
            if (lot.saleDM[tradeCode])
              sellDM = Math.max(sellDM, lot.saleDM[tradeCode]);
          }
          lot.DM = purchaseDM - sellDM;
        }

        lots.sort(function(a, b) {
          if (a.DM === b.DM)
            return a.basePrice > b.basePrice ? -1 : 1;
          else
            return a.DM > b.DM ? -1 : 1;
        });

        for (const lot of lots) {
          let amount = 0
          for (let i = 0; i < lot.tons.dice; i++)
            amount += rng.die(6);
          amount *= lot.tons.multiplier;

          response += `${amount}t of ${lot.type} @ ${formatter.format(lot.basePrice)}Cr; DM ${lot.DM}\n`
        }

      } else {
        response = `You have invalid trade codes and we cannot process the command\n`
      }
    } else {
      response = 'No trade codes supplied. Syntax is "tb spec" with trade codes separated by spaces\n';
    }
    await this.msg.reply(response);
  }

}

Speculation.command = 'SPEC';

module.exports = Speculation;
