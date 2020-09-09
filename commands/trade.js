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

  purchase(code) {
    let response = '';
    for (const good of purchase[code].goods) {
      response += `\t\t${good.name} (DM ${good.DM})\n`;
    }
    if (response.length > 0)
      response = `\t*Buy these:*\n` + response;
    return response;
  }

  sell(code) {
    let response = '';
    for (const good of sell[code].goods) {
      response += `\t\t${good.name} (DM ${good.DM})\n`;
    }
    if (response.length > 0)
      response = `\t*Sell these:*\n` + response;
    return response;
  }

  async do() {
    await super.do();
    let response = '';
    if (this.codes.length > 1 || (this.codes.length === 1 && this.codes[0] !== '')) {
      response = `\n`;
      response += `Codes are ${this.codes}\n`;
      for (const code of this.codes) {
        response += `\n\t**${code}: ${tradeCodes["purchase"][code].description}**\n`;

        response += this.purchase(code);

        response += this.sell(code);
      }
    } else {
      response = 'No trade codes supplied';
    }
    await this.msg.reply(response);
  }

}

Trade.command = 'TRADE';

module.exports = Trade;
