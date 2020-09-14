const BaseCommand = require("./base");

const TradeCodes = ["AG","AS","BA","DE","FL","GA","HI","HT","IC","IN","LO","LT","NA","NI","PO","RI","VA","WA","AZ","RZ"];

class TradeBase extends BaseCommand {
  constructor(prefix, msg) {
    super(prefix, msg);
    this.codes = [];
  }

  parseMsg() {
    let tokens = this.commandText.split(' ');
    // get rid of the command
    tokens.shift();
    this.codes = tokens.map(a => a.toUpperCase());
  }

  codesAreValid (codes) {
    for (const code of codes)
      if (!TradeCodes.includes(code))
        return false;
    return true;
  }

}

module.exports = TradeBase;
