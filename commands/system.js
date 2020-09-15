const BaseCommand = require("./base");
const axios = require('axios').default;

const baseCodes = {
    "C": { allegiance: "Vargr", type: "Corsair Base" },
    "D": { allegiance: "Any", type: "Naval Depot" },
    "E": { allegiance: "Hiver", type: "Embassy" },
    "K": { allegiance: "Any", type: "Naval Base" },
    "M": { allegiance: "Any", type: "Military Base" },
    "N": { allegiance: "Imperial", type: "Naval Base" },
    "R": { allegiance: "Aslan", type: "Clan Base" },
    "S": { allegiance: "Imperial", type: "Scout Base" },
    "T": { allegiance: "Aslan", type: "Tlaukhu Base" },
    "V": { allegiance: "Any", type: "Exploration Base" },
    "W": { allegiance: "Any", type: "Way Station" }
}

class System extends BaseCommand {
  constructor(prefix, msg) {
    super(prefix, msg);
    this.systemName = null;
    this.system = null;
    this.world = null;
  }

  parseMsg() {
    this.systemName = this.commandText;
  }

  makeHexCode(hexX, hexY) {
    const x = ('0' + hexX).slice(-2);
    const y = ('0' + hexY).slice(-2);
    return x + y;
  }

  async findSystemByName(name) {
      const travellerMapSearchURL = `https://travellermap.com/api/search?q=${encodeURIComponent(this.systemName)}`;
      const response = await axios.get(travellerMapSearchURL);
      if (response.status !== 200) {
        throw 'error fetching data';
      }

      if (response.data.Count === 0) {
        throw 'no matches';
      } else {
        return response.data.Results.Items;
      }
  }

  parseRemarks (stringRemarks) {
    const remarksRegex = /(.*)[\(\[](.*)/g;
    let tcList = [];
    let rem = remarksRegex.exec(stringRemarks);
    if (rem) {
      // first item is the string searched
      rem.shift();
      let sopList = [];
      let sophString = "";
      if (rem) {
        tcList = rem[0].split(" ");
        sophString = rem[1];
      }
      // remove last item in tc list - it is empty
      tcList.pop();
      //discard the list of sophonts for now
      //TODO parse sophonts into population splits
    }
    return tcList;
  }

  worldNamesMatch(name1, name2) {
    return name1.localeCompare(name2, undefined, { sensitivity: 'base' }) === 0;
  }

  toTitleCase(str) {
      return str.replace(
          /\w\S*/g,
          function (txt) {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }
      );
  }

  async renderMultipleMatches(systems) {
    let response = 'Multiple matches\n';
    for (const system of systems) {
      if (system.hasOwnProperty('World')) {
        const hex = this.makeHexCode(system.World.HexX, system.World.HexY);
        response += `${system.World.Name}, ${system.World.Sector} ${hex}\n`;
      }
    }
    await this.msg.reply(response);
  }

  async fetchWorldData() {
    const sector = encodeURIComponent(this.system.World.Sector);
    const hex = encodeURIComponent(this.makeHexCode(this.system.World.HexX, this.system.World.HexY));
    const travellerMapWorldURL = `https://travellermap.com/data/${sector}/${hex}`;
    const worldResponse = await axios.get(travellerMapWorldURL);
    if (worldResponse.status !== 200) {
      throw 'error fetching world data';
    }
    this.world = worldResponse.data.Worlds[0];
  }

  async renderSystemData() {
    if (this.world === null)
      await this.fetchWorldData();
    let response = `The ${this.world.Name} system is located in ${this.world.Sector} ${this.world.Hex}\n`;
    response += `It has a UWP of ${this.world.UWP}\n`;
    response += `There are ${this.world.Worlds} planets orbiting the ${this.world.Stellar} star\n`;

    if (this.world.Zone === "A") {
      response += "This world is an **Amber** zone\n";
    } else if (this.world.Zone === "R") {
      response += `This world is a **RED** zone\n`;
    } else {
      response += "There are no travel restrictions\n";
    }

    if (this.world.PBG.slice(this.world.PBG.length - 1) === "0") {
      response += "There is **no** Gas Giant suitable for refueling in this system\n";
    } else {
      response += "There is at least one **Gas Giant** suitable for refueling in this system\n";
    }

    response += `This world owes allegiance to the ${this.world.AllegianceName}\n`;
    if (this.world.Bases.length > 0) {
      response += `It has the following bases:\n`;
      for (const base of this.world.Bases) {
        response += `\t${baseCodes[base].type}\n`;
      }
    } else {
      response += `There are no bases\n`;
    }

    //parse remarks - this field is overloaded with items and needs to be unpacked. No I'm not bitter, why do you ask?
    const tradeCodes = this.parseRemarks(world.Remarks);
    response += `Other system information (trade codes and pop splits) **${world.Remarks}**\n`;

    await this.msg.reply(response);
  }

  async do() {
    await super.do();
    try {
      const systems = await this.findSystemByName();
      if (systems.length === 1) {
        this.system = systems[0];
        await this.renderSystemData();
      } else {
        for (const system of systems) {
          if (system.hasOwnProperty('World') && this.worldNamesMatch(this.systemName, system.World.Name)) {
            this.system = system;
            return await this.renderSystemData();
          }
        }
        await this.renderMultipleMatches(systems);
      }
    } catch (error) {
      console.log(error);
      this.msg.reply('Error looking up system');
    }
  }

}

System.command = '';

module.exports = System;
