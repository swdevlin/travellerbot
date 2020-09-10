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
    // sort by the name of the item and the dm
    selectedGoods.sort(
      function(a, b) {          
         if (a.name === b.name) {
            // DM is only important when names are the same
            return b.DM - a.DM;
         }
         return a.name > b.name ? 1 : -1;
      });
    // walk array and remove duplicates
    let index = 0;
    let prevName = "";
    let newArray = [];
    for (const good of selectedGoods) {
      if (good.name != prevName) {
        newArray.push(good)
      }
      index ++;
      prevName = good.name;
    }
    // sort by the DM of the item
    newArray.sort(function(a, b) {
      return b.DM - a.DM;
    });

    let response = ``;
    for (const good of newArray) {
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

  validateCodes () {
    let validCodesAre = ["AG","AS","BA","DE","FL","GA","HI","HT","IC","IN","LO","LT","NA","NI","PO","RI","VA","WA","AZ","RZ"];
    for (const code of this.codes) {
      if (validCodesAre.includes(code)) {
        continue;
      }else{
        return false;
      }
    }
    return true;
  }


  async do() {
    await super.do();
    let response = '';
    if (this.codes.length > 1 || (this.codes.length === 1 && this.codes[0] !== '')) {
      if (this.validateCodes()) {
        response = `\n`;
        response += `Codes are ${this.codes}\n`;
        response += this.purchase();
        response += this.sell();
      }else{
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
