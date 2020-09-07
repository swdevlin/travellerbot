require('dotenv').config();

const Discord = require('discord.js');
const discordClient = new Discord.Client();

const prefix = process.env.COCBOT_PREFIX || 'tb';

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

const UWPRegex = /(.)(.)(.)(.)(.)(.)(.)\-(.)/;

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
      let response = `Starport: ${uwp[0]} \n`;
      response += `Size: ${uwp[1]} \n`;
      response += `Atmosphere: ${uwp[2]} \n`;
      response += `Hydrosphere: ${uwp[3]} \n`;
      response += `Population: ${uwp[4]} \n`;
      response += `Government: ${uwp[5]} \n`;
      response += `Law: ${uwp[6]} \n`;
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
