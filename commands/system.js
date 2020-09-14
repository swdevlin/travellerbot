const BaseCommand = require("./base");

const {tradeCodes, purchase, sell} = require("../trade_codes");

const baseCodes = {
    "A": {Allegience: "Imperial", Type: "Naval and Scout Bases"},
    "B": {Allegience: "Imperial", Type: "Naval Base and Way Station"},
    "C": {Allegience: "Vargr", Type: "Corsair Base"},
    "D": {Allegience: "Imperial", Type: "Depot"},
    "E": {Allegience: "Hiver", Type: "Embassy Center"},
    "F": {Allegience: "", Type: "Military and Naval Base"},
    "G": {Allegience: "Vargr", Type: "Naval Base"},
    "H": {Allegience: "Vargr", Type: "Naval and Corsair Base"},
    "I": {Allegience: "", Type: "Naval Base"},
    "J": {Allegience: "Imperial", Type: "Naval and Scout"},
    "K": {Allegience: "Imperial", Type: "Naval and Scout"},
    "L": {Allegience: "Imperial", Type: "Naval and Scout"},
    "M": {Allegience: "Imperial", Type: "Naval and Scout"},
    "N": {Allegience: "Imperial", Type: "Naval and Scout"},
    "O": {Allegience: "Imperial", Type: "Naval and Scout"},
    "P": {Allegience: "Imperial", Type: "Naval and Scout"},
    "Q": {Allegience: "Imperial", Type: "Naval and Scout"},
    "R": {Allegience: "Imperial", Type: "Naval and Scout"},
    "S": {Allegience: "Imperial", Type: "Naval and Scout"},
    "T": {Allegience: "Imperial", Type: "Naval and Scout"},
    "U": {Allegience: "Imperial", Type: "Naval and Scout"},
    "V": {Allegience: "Imperial", Type: "Naval and Scout"},
    "W": {Allegience: "Imperial", Type: "Naval and Scout"},
    "X": {Allegience: "Imperial", Type: "Naval and Scout"},
    "Y": {Allegience: "Imperial", Type: "Naval and Scout"},
    "Z": {Allegience: "Imperial", Type: "Naval and Scout"}
}

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

  makeHexCode(hexX, hexY) {
    let hexXOut = hexX.toString();
    let hexYOut = hexY.toString();
    if (hexXOut.length < 2) {
        hexXOut = "0" + hexXOut;    
    }
    if (hexYOut.length < 2) {
        hexYOut = "0" + hexYOut;    
    }
    return hexXOut + hexYOut;
  }

  getSystemInformation (name) {
      let response = "";
      //const urlTravellerMapSearch = "https://travellermap.com/api/search?q=";
      //urlTravellerMapSearch += name;
     // const urlResponse = fetch(urlTravellerMapSearch);
     // const systemDetails = urlResponse.json(); //extract JSON from the http response
     const systemDetails = {"Results":{"Count":1,"Items":[{"World":{"HexX":29,"HexY":6,"Sector":"Deneb","Uwp":"C5A5422-A","SectorX":-3,"SectorY":-1,"Name":"Nurara","SectorTags":"Official OTU"}}]}};

      
      // do something with system details
      const worldDetails = systemDetails.Results.Items[0].World;
      response += `The ${this.toTitleCase(name)} system is in the ${worldDetails.Sector} sector\n`;
      response += `It has a UWP of ${worldDetails.Uwp}\n`;
      const hexCode =this.makeHexCode(worldDetails.HexX, worldDetails.HexY)
      response += `The Hex Code for this system is ${hexCode}\n`;

      const moreDetails = {"Worlds":[{"Name":"Nurara","Hex":"2906","UWP":"C5A5422-A","PBG":"604","Zone":"","Bases":"S","Allegiance":"ImDd","Stellar":"M0 V","SS":"D","Ix":"{ 0 }","CalculatedImportance":0,"Ex":"(A33-4)","Cx":"[1416]","Nobility":"B","Worlds":9,"ResourceUnits":-360,"Subsector":3,"Quadrant":1,"WorldX":-68,"WorldY":-74,"Remarks":"Fl Ni","LegacyBaseCode":"S","Sector":"Deneb","SubsectorName":"Million","SectorAbbreviation":"Dene","AllegianceName":"Third Imperium, Domain of Deneb"}]};
      const world = moreDetails.Worlds[0];
      if (world.Zone == "A") {
          response += "This world is an **Amber** zone\n";
      }else{
          if (world.Zone == "R") {
            response += `This world is a **RED** zone\n`;
        }else {
            response += "This world in **not** an Amber or Red Zone world\n";
        }
      }
      if( world.PBG.slice(world.PBG.length - 1) == "0") {
        response += "There is **no** Gas Giant suitable for refueling in this system\n";
      }else{
          response += "There is at least one **Gas Giant** suitable for refueling in this system\n";
      }
      response += `It has the followng bases: ${baseCodes[world.Bases].Allegience} ${baseCodes[world.Bases].Type}\n`;
      response += `It has the trade codes of **${world.Remarks}**\n`;
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
