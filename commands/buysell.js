const TradeBase = require("./basetrade");

const {purchase, sell} = require("../trade_codes");

const BuySellRegex = /BUY\s+(.+)\s+SELL\s+(.+)/;

class Buy extends TradeBase {
  constructor(prefix, msg) {
    super(prefix, msg);
    this.codes = [];
    this.buyCodes = [];
    this.sellCodes = [];
  }

  parseMsg() {
    let buySell = BuySellRegex.exec(this.commandText);
    if (buySell) {
      buySell.shift(); // get rid of compared text
      const [bcodes, scodes] = buySell;
      let tokens = bcodes.trim().split(' ')
      this.buyCodes = tokens.map(a => a.toUpperCase());
      tokens = scodes.trim().split(' ')
      this.sellCodes = tokens.map(a => a.toUpperCase());
    }
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
              matches.push({
                name: buyGood.name,
                buyDM: buyGood.DM,
                buyCode: buyGood.code,
                sellDM: sellGood.DM,
                sellCode: sellGood.code
              });
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
      response += `(${this.formatTradeClassification(good.buyCode)}) `;
      response += "\n\t\tSell at: ";
      if (good.sellDM < 0) {
        response += `**DM ${good.sellDM}** `;
      }else{
        response += `DM +${good.sellDM} `;
      }
      response += `(${this.formatTradeClassification(good.sellCode)})\n`;    }
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
    return this.codesAreValid(this.buyCodes) && this.codesAreValid(this.sellCodes);
  }

  async do() {
    await super.do();
    let response;
    if (this.buyCodes.length > 0 && this.sellCodes.length) {
      if (this.validateCodes()) {
        let codeList = this.buyCodes.map(code => this.formatTradeClassification(code)).join(', ');
        response = `\nThe BUY Codes are ${codeList}\n`;
        codeList = this.sellCodes.map(code => this.formatTradeClassification(code)).join(', ');
        response += `The SELL Codes are ${codeList}\n`;
        response += this.compareGoods(this.cleanGoods(this.purchase()), this.cleanGoods(this.sell()))
      } else {
        response = `You have invalid trade codes and we cannot process the command\n`
      }
    } else {
      response = 'No trade codes supplied. Syntax is "tb buy {codes} sell {codes}" with trade codes separated by spaces\n';
    }
    await this.msg.reply(response);
  }

}

Buy.command = 'BUY';

module.exports = Buy;
