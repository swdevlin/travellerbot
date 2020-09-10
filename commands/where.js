const BaseCommand = require("./base");

const {tradeCodes, purchase, sell} = require("../trade_codes");

class Where extends BaseCommand {
  constructor(prefix, msg) {
    super(prefix, msg);
    this.codes = [];
    this.goodName = "";
  }

  parseMsg() {
    let tokens = this.commandText.split(' ');
    // get rid of the trade
    tokens.shift();
    this.codes = tokens.map(a => a.toUpperCase());
  }

    findGoods () {
    let sellCodes = [];
    let validCodesAre = ["AG","AS","BA","DE","FL","GA","HI","HT","IC","IN","LO","LT","NA","NI","PO","RI","VA","WA","AZ","RZ"];
    for (const code of validCodesAre) {
        for (const item of sell[code].goods) {
            if (item.name == this.goodName) {
                sellCodes.push( {DM:item.DM, code:code, description:sell[code].description});
            }
        }
    } 
    let response = "";
    for (const item of sellCodes) {
        response += `\t${item.description} (${item.code}): `;
        if (item.DM < 0) {
         response += `**DM ${item.DM}**\n`;
        }else{
         response += `DM +${item.DM}\n`;
        }
    }
    if (response.length > 0) {
        response = `Best places to sell  ${this.goodName}:\n` + response;
      }else{
        response = "\t**No matches found. Good Luck!**\n";  
      }    
  
    return response;
  }

  toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
    }

  async do() {
    await super.do();
    let response = '\n';
    if (this.codes.length > 1 || (this.codes.length === 1 && this.codes[0] !== '')) {
      this.goodName = this.toTitleCase( this.codes.join(" ") );  
      response += this.findGoods();  
    } else {
      response = 'No item name provided. Syntax is "tb where" followed by and item name\n';
    }
    await this.msg.reply(response);
  }

}

Where.command = 'WHERE';

module.exports = Where;
