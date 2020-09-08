require('dotenv').config();
const fs = require('fs');

const Discord = require('discord.js');
const discordClient = new Discord.Client();

const prefix = process.env.TRBOT_PREFIX || 'tb';

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

const UWPRegex = /(.)(.)(.)(.)(.)(.)(.)\-(.)/;

const starports = JSON.parse(fs.readFileSync('data/starport.json', 'utf8'));

const planetSizes = JSON.parse(fs.readFileSync('data/planet_size.json', 'utf8'));

const governments = JSON.parse(fs.readFileSync('data/government.json', 'utf8'));

const atmospheres = JSON.parse(fs.readFileSync('data/atmosphere.json', 'utf8'));

const hydrospheres = JSON.parse(fs.readFileSync('data/hydrographic.json', 'utf8'));

const lawLevels = JSON.parse(fs.readFileSync('data/law_level.json', 'utf8'));

const techLevels = JSON.parse(fs.readFileSync('data/tech_level.json', 'utf8'));

const tradeCodes = JSON.parse(fs.readFileSync('trade_codes.json', 'utf8'));

const codeIsValid = (code) => {
  return (code.length === 1 && '0123456789ABCDEFX'.includes(code));
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

discordClient.on('message', async msg => {
  // ignore our own messages
  if (`${msg.author.username}#${msg.author.discriminator}` === discordClient.user.tag)
    return;

  if (!msg.content.startsWith(prefix))
    return;


  const message = msg.content.substring(prefix.length).trim().toUpperCase();
  const {id: author_id} = msg.author;
  const {guild} = msg.channel;
  const {id: guild_id} = guild;
  try {
    if (message.startsWith("TRADE")) {
      tradeCodeList = message.slice(6).split(" ");
      let response = `\n`;
      response += `Codes are ${tradeCodeList}\n`;
      for (index = 0; index < tradeCodeList.length; ++index) {
        response += `\t${tradeCodeList[index]}: ${tradeCodes["purchase"][tradeCodeList[index]].description}\n`;
      }
      response += `The Trade Code function is not yet operational`;
      await msg.reply(response);
    }else{
      let uwp = UWPRegex.exec(message);
      if (uwp) {
        uwp.shift();
        for (const code of uwp)
          if (!codeIsValid(code))
            msg.reply(`${msg.content} is an invalid UWP`);
        const [starport, size, atmosphere, hydrosphere, population, goverment, law, tech] = uwp;

        // define extra details for each item
        let spdetail = ``;
        if(starports[starport].quality == "None") {
          spdetail += `\tThere is **no starport** on this planet\n`;
        }else{
          spdetail += `\tThis port is ${starports[starport].quality}\n`;
        }
        spdetail += `\tBerthing costs are ${starports[starport].berthingCost} per day\n`;
        if(starports[starport].fuelAvailable == "None") {
          spdetail += `\tThis port has **No fuel**`;
        }else{
          spdetail += `\tThis port has ${starports[starport].fuelAvailable} fuel`;
        }
        const sizeDetail = `\t${planetSizes[size].diameter} in diameter\n\tGravity is ${planetSizes[size].gravity}G`;
        let atdetail = `\t${atmospheres[atmosphere].composition} atmosphere\n\t`;
        if(atmospheres[atmosphere].gearRequired == "None") {
          atdetail += `No special gear is required`;
        }else{
          atdetail += `This atmosphere requires ${atmospheres[atmosphere].gearRequired}`;
        }
        const hyddetail = `\t${hydrospheres[hydrosphere].description}`;
        let popdetail = `\t`;
        // TODO format this with commas, no decimal
        popdetail += formatNumber(10**Number(population));
        const govdetail = `\t${governments[goverment]}`;
        const lawdetail = `\t*Bans*:\n\t\t${lawLevels[law].weaponsBanned};\n\t\t${lawLevels[law].armourBanned}`;
        const techdetail = `\tTL ${techLevels[tech].level}\n\t${techLevels[tech].shortDescription}`;

        // define response to start with cr to drop off line with name
        let response = `\n`;
        response += `**Starport (${starport})**\n${spdetail}\n`;
        response += `**Size (${size})**\n${sizeDetail}\n`;
        response += `**Atmosphere (${atmosphere})**\n${atdetail} \n`;
        response += `**Hydrosphere (${hydrosphere})**\n${hyddetail}\n`;
        response += `**Population: (${population})**\n${popdetail}\n`;
        response += `**Government (${goverment})**\n${govdetail} \n`;
        response += `**Law (${law})**\n${lawdetail}  \n`;
        response += `**Tech (${tech})**\n ${techdetail}  \n`;
        await msg.reply(response);
      }
    }
  } catch(err) {
    console.log(err);
    await msg.reply(err);
  } finally {
    console.log(`${guild_id} ${author_id} ${msg.content}`);
  }
});

discordClient.login(process.env.DISCORD_TOKEN);
