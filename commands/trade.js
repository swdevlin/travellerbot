const TradeBase = require("./basetrade");

const {purchase, sell} = require("../trade_codes");

class Trade extends TradeBase {

  generateResponse(type, selectedGoods) {
    // sort by the name of the item and the dm
    selectedGoods.sort(
      function(a, b) {          
         if (a.name === b.name) {
            // DM is only important when names are the same
            return b.DM - a.DM;
         }
         return a.name > b.name ? 1 : -1;
      }
    );

    // walk array and remove duplicates
    let prevName = "";
    let newArray = [];
    for (const good of selectedGoods) {
      if (good.name !== prevName) {
        newArray.push(good)
      }
      prevName = good.name;
    }

    // sort by the DM of the item
    newArray.sort(function(a, b) {return b.DM - a.DM;});

    let response = ``;
    for (const good of newArray) {
      response += `\t\t${good.name} (${good.code}): `;
      if (good.DM < 0) {
        response += `**DM ${good.DM}** `;
      } else {
        response += `DM +${good.DM} `;
      }
      response += '\n';
    }

    if (response.length > 0)
      response = `\t*${type} these:*\n` + response;

    return response;
  }

  purchase() {
    let selectedGoods = [];
    for (const code of this.codes) {
      for (const good of purchase[code].goods) {
        selectedGoods.push({DM:good.DM, name:good.name, code:code});
      }
    }

    return this.generateResponse("Buy", selectedGoods);
  }

  sell() {
    let selectedGoods = [];
    for (const code of this.codes) {
      for (const good of sell[code].goods) {
        selectedGoods.push({DM:good.DM, name:good.name, code:code});
      }
    }

    return this.generateResponse("Sell", selectedGoods);
  }


  async do() {
    await super.do();
    let response;
    if (this.codes.length > 1 || (this.codes.length === 1 && this.codes[0] !== '')) {
      if (this.codesAreValid(this.codes)) {
        response = `\n`;
        response += `Codes are ${this.codes}\n`;
        response += this.purchase();
        response += this.sell();
      } else {
        response = `You have invalid trade codes and we cannot process the command\n`
      }
    } else {
      response = 'No trade codes supplied. Syntax is "tb trade" with trade codes separated by spaces\n';
    }
    await this.msg.reply(response);
  }

}

Trade.command = 'TRADE';

module.exports = Trade;
