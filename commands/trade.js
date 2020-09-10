const BaseCommand = require("./base");

const {tradeCodes, purchase, sell} = require("../trade_codes");

class Trade extends BaseCommand {
  constructor(prefix, msg) {
    super(prefix, msg);
    this.codes = [];
  }

  parseMsg() {
    let tokens = this.commandText.split(' ');
    // get rid of the trade
    tokens.shift();
    this.codes = tokens.map(a => a.toUpperCase());
  }

  generateResponse(type, selectedGoods) {
    let response = ``;
    for (const good of selectedGoods) {
      if (good.DM < 0) {
        response += `\t\t**DM ${good.DM}** `;
      }else{
        response += `\t\tDM +${good.DM} `;
      }
      response += `${good.name} (${good.code})\n`;
    }
    if (response.length > 0)
      response = `\t*${type} these:*\n` + response;
    return response;
  }

  purchase() {
    let selectedGoods = [];
    for (const code of this.codes) {
      for (const good of purchase[code].goods) {
        selectedGoods.push({"DM":good.DM, "name":good.name, "code":code});
      }
    }
    selectedGoods.sort(function(a, b) {
      return b.DM - a.DM;
    });

    return this.generateResponse("Buy", selectedGoods);
  }

  sell() {
    let selectedGoods = [];
    for (const code of this.codes) {
      for (const good of sell[code].goods) {
        selectedGoods.push({"DM":good.DM, "name":good.name, "code":code});
      }
    }
    selectedGoods.sort(function(a, b) {
      return b.DM - a.DM;
    });

    return this.generateResponse("Sell", selectedGoods);
  }


  async do() {
    await super.do();
    let response = '';
    if (this.codes.length > 1 || (this.codes.length === 1 && this.codes[0] !== '')) {
      response = `\n`;
      response += `Codes are ${this.codes}\n`;
      response += this.purchase();
      response += this.sell();
/*       let respList = ``;
      for (const code of this.codes) {
        respList += this.purchase(code);
      }
      if (respList.length > 0)
        response += `\t*Buy these:*\n` + respList;

      respList = ``;
      for (const code of this.codes) {
        respList += this.sell(code);
      }
      if (respList.length > 0)
        response += `\t*Sell these:*\n` + respList;
 */

    } else {
      response = 'No trade codes supplied';
    }
    await this.msg.reply(response);
  }

}

Trade.command = 'TRADE';

module.exports = Trade;
