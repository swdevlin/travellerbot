const BaseCommand = require("./base");

const {tradeCodes, purchase, sell} = require("../trade_codes");

class Buy extends BaseCommand {
  constructor(prefix, msg) {
    super(prefix, msg);
    this.codes = [];
    this.buyCodes = [];
    this.sellCodes = [];
  }

  parseMsg() {
    let tokens = this.commandText.split(' ');
    // get rid of the trade
    tokens.shift();
    this.codes = tokens.map(a => a.toUpperCase());
  }

  cleanGoods(selectedGoods) {
    // sort array by the name of the item and the dm
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
    return newArray;  
  }

  compareGoods(buyGoods, sellGoods) {
    let matches = [];
    for (const buyGood of buyGoods) {
      for (const sellGood of sellGoods) {
          if (buyGood.name == sellGood.name) {
              matches.push({name:buyGood.name,buyDM:buyGood.DM,buyCode:buyGood.code,sellDM:sellGood.DM,sellCode:sellGood.code});
          }
      }  
    }
    let response = ``;
    for (const good of matches) {
      response += `\t**${good.name}**\n\t\tBuy at: `;  
      if (good.buyDM < 0) {
        response += `**DM ${good.buyDM}** `;
      }else{
        response += `DM +${good.buyDM} `;
      }
      response += `(${good.buyCode}) `;
      response += "\n\t\tSell at: ";
      if (good.sellDM < 0) {
        response += `**DM ${good.sellDM}** `;
      }else{
        response += `DM +${good.sellDM} `;
      }
      response += `(${good.sellCode})\n`;    }
    if (response.length > 0) {
      response = `\t*I found the following matches:*\n` + response;
    }else{
      response = "\t**No matches found. Good Luck!**\n";  
    }    
    return response;
  }

  purchase() {
    let selectedGoods = [];
    for (const code of this.buyCodes) {
      for (const good of purchase[code].goods) {
        selectedGoods.push({DM:good.DM, name:good.name, code:code});
      }
    }

    return selectedGoods;
  }

  sell() {
    let selectedGoods = [];
    for (const code of this.sellCodes) {
      for (const good of sell[code].goods) {
        selectedGoods.push({DM:good.DM, name:good.name, code:code});
      }
    }

    return selectedGoods;
  }

  validateCodes () {
    let validCodesAre = ["AG","AS","BA","DE","FL","GA","HI","HT","IC","IN","LO","LT","NA","NI","PO","RI","VA","WA","AZ","RZ"];
    let storeBuy = true;
    for (const code of this.codes) {
      if (code == "SELL") {
          storeBuy = false;
          continue;
      }  
      if (validCodesAre.includes(code)) {
        if (storeBuy) {
            this.buyCodes.push(code);
        }else{
            this.sellCodes.push(code);
        }  
        continue;
      }else{
        return false;
      }
    }
    return true;
  }


  async do() {
    await super.do();
    let response = '\n';
    if (this.codes.length > 1 || (this.codes.length === 1 && this.codes[0] !== '')) {
      if (this.validateCodes()) {
        response += `The BUY Codes are ${this.buyCodes}\n`;
        response += `The SELL Codes are ${this.sellCodes}\n`;
        response += this.compareGoods(this.cleanGoods(this.purchase()), this.cleanGoods(this.sell()))
      } else {
        response = `You have invalid trade codes and we cannot process the command\n`
      }
    } else {
      response = 'No trade codes supplied. Syntax is "tb trade" with trade codes separated by spaces\n';
    }
    await this.msg.reply(response);
  }

}

Buy.command = 'BUY';

module.exports = Buy;
