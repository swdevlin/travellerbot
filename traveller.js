require('dotenv').config();
const fs = require('fs');

const Discord = require('discord.js');
const discordClient = new Discord.Client();

const prefix = process.env.COCBOT_PREFIX || 'tb';

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

const UWPRegex = /(.)(.)(.)(.)(.)(.)(.)\-(.)/;

const starports = JSON.parse(fs.readFileSync('data/starport.json', 'utf8'));

const governments = JSON.parse(fs.readFileSync('data/government.json', 'utf8'));

const atmospheres = JSON.parse(fs.readFileSync('data/atmosphere.json', 'utf8'));

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

      // get the starport details
      const sp = `\n|**Quality**|${starports[starport].quality}|\n|**Berthing Costs**|${starports[starport].berthingCost}|\n|**Fuel Available**|${starports[starport].fuelAvailable}|`;
      let response = `Starport ${starport}: ${sp}\n`;
      response += `Size: ${size} \n`;
      response += `Atmosphere ${atmosphere}: ${atmospheres[atmosphere].composition} ${atmospheres[atmosphere].gearRequired} \n`;
      response += `Hydrosphere: ${hydrosphere} \n`;
      response += `Population: ${population} \n`;
      response += `Government ${goverment}: ${governments[goverment]} \n`;
      response += `Law ${law}: Bans - ${lawLevels[law].weaponsBanned}; ${lawLevels[law].armourBanned} \n`;
      response += `Tech ${tech}: ${techLevels[tech].level}  \n`;
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
