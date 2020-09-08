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

const governments = JSON.parse(fs.readFileSync('data/government.json', 'utf8'));

const atmospheres = JSON.parse(fs.readFileSync('data/atmosphere.json', 'utf8'));

const hydrospheres = JSON.parse(fs.readFileSync('data/hydrographic.json', 'utf8'));

const lawLevels = JSON.parse(fs.readFileSync('data/law_level.json', 'utf8'));

const techLevels = JSON.parse(fs.readFileSync('data/tech_level.json', 'utf8'));

const codeIsValid = (code) => {
  return (code.length === 1 && '0123456789ABCDEF'.includes(code));
}

discordClient.on('message', async msg => {
  // ignore our own messages
  if (`${msg.author.username}#${msg.author.discriminator}` === discordClient.user.tag)
    return;

  if (!msg.content.startsWith(prefix))
    return;


  const message = msg.content.substring(2).trim().toUpperCase();
  const {id: author_id} = msg.author;
  const {guild} = msg.channel;
  const {id: guild_id} = guild;
  try {
    let uwp = UWPRegex.exec(message);
    if (uwp) {
      uwp.shift();
      for (const code of uwp)
        if (!codeIsValid(code))
          msg.reply(`${msg.content} is an invalid UWP`);
      const [starport, size, atmosphere, hydrosphere, population, goverment, law, tech] = uwp;

      // define extra details for each item
      const spdetail = `\tThis port is ${starports[starport].quality}\n\tBerthing costs are ${starports[starport].berthingCost} per day\n\tThis port has ${starports[starport].fuelAvailable} fuel`;
      const sizdetail = `\t`;
      let atdetail = `\t${atmospheres[atmosphere].composition} atmosphere\n\t`;
      if(atmospheres[atmosphere].gearRequired == "None") {
        atdetail += `No special gear is required`;
      }else{
        atdetail += `This atmosphere requires ${atmospheres[atmosphere].gearRequired}`;
      }
      const hyddetail = `\t${hydrospheres[hydrosphere].description}`;
      let popdetail = `\t`;
      // TODO format this with commas, no decimal
      popdetail += 10**Number(population);
      const govdetail = `\t${governments[goverment]}`;
      const lawdetail = `\t*Bans*: ${lawLevels[law].weaponsBanned}; ${lawLevels[law].armourBanned}`;
      const techdetail = `\tTL ${techLevels[tech].level}\n\t${techLevels[tech].shortDescription}`;

      // define response to start with cr to drop off line with name
      let response = `\n`;
      response += `**Starport (${starport})**\n${spdetail}\n`;
      response += `**Size (${size})**\n${sizdetail}\n`;
      response += `**Atmosphere (${atmosphere})**\n${atdetail} \n`;
      response += `**Hydrosphere (${hydrosphere})**\n${hyddetail}\n`;
      response += `**Population: (${population})**\n${popdetail}\n`;
      response += `**Government (${goverment})**\n\t${govdetail} \n`;
      response += `**Law (${law})**\n${lawdetail}  \n`;
      response += `**Tech (${tech})**\n ${techdetail}  \n`;
      await msg.reply(response);
    }
  } catch(err) {
    console.log(err);
    await msg.reply(err);
  } finally {
    console.log(`${guild_id} ${author_id} ${msg.content}`);
  }
});

discordClient.login(process.env.DISCORD_TOKEN);
