const BaseCommand = require("./base");

const {sell} = require("../trade_codes");

const TradeCodes = ["AG","AS","BA","DE","FL","GA","HI","HT","IC","IN","LO","LT","NA","NI","PO","RI","VA","WA","AZ","RZ"];

class Where extends BaseCommand {
  constructor(prefix, msg) {
    super(prefix, msg);
    this.goodName = "";
  }

  parseMsg() {
    this.goodName = this.commandText.substring(this.commandText.indexOf(' ')+1);
  }

  findGoods () {
    let sellCodes = [];
    for (const code of TradeCodes) {
        for (const item of sell[code].goods) {
            if (item.name.localeCompare(this.goodName, undefined, { sensitivity: 'base' }) === 0) {
                sellCodes.push( {DM:item.DM, code:code, description:sell[code].description});
            }
        }
    } 

    let response = "";
    for (const item of sellCodes) {
        response += `\t${item.description} (${this.formatTradeClassification(item.code)}): `;
        if (item.DM < 0) {
         response += `**DM ${item.DM}**\n`;
        }else{
         response += `DM +${item.DM}\n`;
        }
    }

    if (response.length > 0) {
        response = `Best places to sell\n${this.goodName}:\n` + response;
    } else {
        response = "\t**No matches found. Good Luck!**\n";  
    }
  
    return response;
  }

  async do() {
    await super.do();
    let response;
    if (this.goodName.length > 0)
      response = this.findGoods();
    else
      response = 'No item name provided. Syntax is "tb where" followed by and item name\n';
    await this.msg.reply(response);
  }

}

Where.command = 'WHERE';

module.exports = Where;
