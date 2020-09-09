require('dotenv').config();

const Discord = require('discord.js');
const discordClient = new Discord.Client();

const prefix = process.env.TRBOT_PREFIX || 'tb';

const {getCommandObject} = require("./commandparser");

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on('message', async msg => {
  // ignore our own messages
  if (`${msg.author.username}#${msg.author.discriminator}` === discordClient.user.tag)
    return;

  if (!msg.content.startsWith(prefix))
    return;

  const {id: author_id} = msg.author;
  const {guild} = msg.channel;
  const {id: guild_id} = guild;
  try {
    const command = getCommandObject(prefix, msg);
    if (command !== null) {
      await command.do();
    } else {
      await msg.reply('invalid command');
    }
  } catch(err) {
    console.log(err);
    await msg.reply(err);
  } finally {
    console.log(`${guild_id} ${author_id} ${msg.content}`);
  }
});

discordClient.login(process.env.DISCORD_TOKEN);
