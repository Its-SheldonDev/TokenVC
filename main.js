const fs = require('fs');
const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const { CustomStatus } = require('discord.js-selfbot-rpc');
const gradient = require('gradient-string');
const config = require('./config.json');

async function connectToVoice(token) {
  const client = new Client({
    checkUpdate: false,
  });

  client.on('ready', async () => {
    console.log(gradient("#0330fc", "#0398fc")(`Token Vocal Made By $heldon#0001`));
    console.log(`[+] Nom du compte: ${client.user.username}`);

    const customStatus = new CustomStatus()
      .setStatus(config.status) // Style de status : dnd, idle, online
      .setState(config.state)
      .setEmoji(config.emojistatus);
    client.user.setPresence(customStatus.toData());

    console.log(`${client.user.username} est connecté dans le vocal !`);

    try {
      const voiceChannel = await client.channels.fetch(config.vocal);
      const voiceConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        selfDeaf: config.casque
      });

    } catch (error) {
      console.error(`Impossible de rejoindre le canal vocal : ${error}`);
    }
  });

  await client.login(token);
}

async function connectAllTokens() {
  try {
    const tokens = fs.readFileSync('tokens.txt', 'utf8').split('\n');
    for (const token of tokens) {
      if (token.trim() !== '') {
        await connectToVoice(token.trim());
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier tokens.txt : ${error}`);
  }
}

connectAllTokens();
