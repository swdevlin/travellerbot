const BaseCommand = require("./base");
const axios = require('axios').default;

class System extends BaseCommand {
  constructor(prefix, msg) {
    super(prefix, msg);
    this.systemName = null;
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
      const travellerMapSearchURL = `https://travellermap.com/api/search?q=${this.systemName}`;
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

  toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
  }

  async renderMultipleMatches(systems) {
    let response = 'Multiple matches\n';
    for (const system of systems) {
      const hex = this.makeHexCode(system.World.HexX, system.World.HexY);
      response += `${system.World.Name}, ${system.World.Sector} ${hex}\n`;
    }
    await this.msg.reply(response);
  }

  async renderSystemData(system) {
    const sector = system.World.Sector;
    const hex = this.makeHexCode(system.World.HexX, system.World.HexY);
    const travellerMapWorldURL = `https://travellermap.com/data/${sector}/${hex}`;
    const worldResponse = await axios.get(travellerMapWorldURL);
    if (worldResponse.status !== 200) {
      throw 'error fetching world data';
    }
    const world = worldResponse.data.Worlds[0];
    let response = `${world.Name}\n`;
    response += `${world.UWP}\n`;
    response += `${world.Stellar}\n`;
    response += `${world.Remarks}\n`;
    response += `${world.Bases}\n`;
    response += `${world.AllegianceName}\n`;
    await this.msg.reply(response);
  }

  async do() {
    await super.do();
    try {
      const systems = await this.findSystemByName();
      if (systems.length === 1)
        await this.renderSystemData(systems[0]);
      else
        await this.renderMultipleMatches(systems);
    } catch (error) {
      this.msg.reply('Error looking up system');
    }
    // let response = '\n';
    // for (const name of tokens) {
    //     response += `System Information: **${this.toTitleCase(name)}**\n`;
    //     response += this.getSystemInformation(name);
    // }
    // await this.msg.reply(response);
  }

}

System.command = '';

module.exports = System;
