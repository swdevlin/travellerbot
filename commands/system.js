const BaseCommand = require("./base");

const {tradeCodes, purchase, sell} = require("../trade_codes");

class System extends BaseCommand {
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

  getSystemInformation (name) {
      let response = "";
      const urlTravellerMapSearch = "https://travellermap.com/api/search?q=";
      urlTravellerMapSearch += name;
      const urlResponse = fetch(urlTravellerMapSearch);
      const systemDetails = urlResponse.json(); //extract JSON from the http response
      
      // do something with system details
      response += `${systemDetails}`;
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
    const commandText = this.msg.content.substring(this.prefix.length).trim();
    const tokens = commandText.toUpperCase().split(' ');
  
    let response = '\n';
    for (const name of tokens) {
        response += `System Information: **${this.toTitleCase(name)}**\n`;
        response += this.getSystemInformation(name);
    }
    await this.msg.reply(response);
  }

}

System.command = '';

module.exports = System;
