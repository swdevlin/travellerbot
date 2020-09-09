const BaseCommand = require("./base");

const {starports, planetSizes, governments, atmospheres, hydrospheres, lawLevels, techLevels} = require("../uwp_codes");

const UWPRegex = /(.)(.)(.)(.)(.)(.)(.)\-(.)/;

class UWP extends BaseCommand {
  constructor(prefix, msg) {
    super(prefix, msg);
    this.starport = null;
    this.size = null;
    this.atmosphere = null;
    this.hydrosphere = null;
    this.population = null;
    this.government = null;
    this.law = null;
    this.tech = null;
  }

  parseMsg() {
    super.parseMsg();
    let uwp = UWPRegex.exec(this.commandText);
    // first item is the string searched
    uwp.shift();
    if (uwp) {
      [this.starport, this.size, this.atmosphere, this.hydrosphere, this.population, this.government, this.law, this.tech] = uwp;
    }
  }

  validateUWP() {
    return (
      this.starport in starports &&
      this.size in planetSizes &&
      this.atmosphere in atmospheres &&
      this.hydrosphere in hydrospheres &&
      this.government in governments &&
      this.law in lawLevels &&
      this.tech in techLevels
    );
  }

  starportText() {
    const {quality, berthingCost, fuelAvailable} = starports[this.starport];

    let response;
    if (quality === "None") {
      response = '\tThere is **no starport** on this planet\n';
    } else {
      response = `\tThis port is ${quality}\n\tBerthing costs are ${berthingCost} per day\n`;
    }

    if (fuelAvailable === "None") {
      response += '\tThis port has **No fuel**';
    } else {
      response += `\tThis port has ${fuelAvailable} fuel`;
    }

    return response;
  }

  governmentText() {
    return `\t${governments[this.government]}`;
  }

  atmosphereText() {
    const {composition, gearRequired} = atmospheres[this.atmosphere];
    let response = `\t${composition} atmosphere\n\t`;
    if (gearRequired == "None") {
      response += `No special gear is required`;
    } else {
      response += `This atmosphere requires ${gearRequired}`;
    }
    return response;
  }

  lawText() {
    const {weaponsBanned, armourBanned} = lawLevels[this.law];
    return `\t*Bans*:\n\t\t${weaponsBanned};\n\t\t${armourBanned}`;
  }

  hydrosphereText() {
    const {description} = hydrospheres[this.hydrosphere];
    return `\t${description}`;
  }

  techText() {
    const {level, shortDescription, technologyAge, details} = techLevels[this.tech];
    return `\tTL ${level}\n\t${shortDescription}`;
  }

  populationText() {
    const formatter = new Intl.NumberFormat('en-US', {useGrouping: true});
    return '\t' + formatter.format(10**Number(this.population));
  }

  planetSizeText() {
    const {diameter, gravity} = planetSizes[this.size];
    return `\t${diameter} in diameter\n\tGravity is ${gravity}G`;
  }

  async do() {
    await super.do();
    if (this.starport === null || !this.validateUWP()) {
      return await this.msg.reply(`${this.commandText} is an invalid UWP`);
    }
    // define response to start on a new line to drop off line with name
    let response = `\n`;
    response += `**Starport (${this.starport})**\n${this.starportText()}\n`;
    response += `**Size (${this.size})**\n${this.planetSizeText()}\n`;
    response += `**Atmosphere (${this.atmosphere})**\n${this.atmosphereText()} \n`;
    response += `**Hydrosphere (${this.hydrosphere})**\n${this.hydrosphereText()}\n`;
    response += `**Population: (${this.population})**\n${this.populationText()}\n`;
    response += `**Government (${this.government})**\n${this.governmentText()} \n`;
    response += `**Law (${this.law})**\n${this.lawText()}  \n`;
    response += `**Tech (${this.tech})**\n ${this.techText()}  \n`;
    await this.msg.reply(response);
  }

}

UWP.command = null;

module.exports = UWP;
