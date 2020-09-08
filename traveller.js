require('dotenv').config();
const fs = require('fs');

const Discord = require('discord.js');
const discordClient = new Discord.Client();

const prefix = process.env.COCBOT_PREFIX || 'tb';

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

const UWPRegex = /(.)(.)(.)(.)(.)(.)(.)\-(.)/;

const starport = JSON.parse(fs.readFileSync('data/starport.json', 'utf8'));

const government = JSON.parse(fs.readFileSync('data/government.json', 'utf8'));

const atmosphere = JSON.parse(fs.readFileSync('data/atmosphere.json', 'utf8'));

const lawLevels = JSON.parse(fs.readFileSync('data/law_level.json', 'utf8'));

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
  
      // get the starport details
      const sp = `${starport[uwp[0]].quality} Berthing Costs: ${starport[uwp[0]].berthingCost} Fuel Available: ${starport[uwp[0]].fuelAvailable}`;
      let response = `Starport ${uwp[0]}: ${sp}\n`;
      response += `Size: ${uwp[1]} \n`;
      response += `Atmosphere ${uwp[2]}: ${atmosphere[uwp[2]].composition} ${atmosphere[uwp[2]].gearRequired} \n`;
      response += `Hydrosphere: ${uwp[3]} \n`;
      response += `Population: ${uwp[4]} \n`;
      response += `Government ${uwp[5]}: ${government[uwp[5]]} \n`;
      response += `Law ${uwp[6]}: Bans - ${lawLevels[uwp[6]].weaponsBanned}; ${lawLevels[uwp[6]].armourBanned} \n`;
      response += `Tech: ${uwp[7]} \n`;
      console.log(response);
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
