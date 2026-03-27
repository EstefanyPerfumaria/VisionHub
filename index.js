const { Client, GatewayIntentBits, SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

// comando /say
const commands = [
  new SlashCommandBuilder()
    .setName('say')
    .setDescription('Faz o bot falar')
    .addStringOption(option =>
      option.setName('mensagem')
        .setDescription('Mensagem que o bot vai enviar')
        .setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands },
    );
    console.log('Comando registrado!');
  } catch (error) {
    console.error(error);
  }
})();

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'say') {
    const msg = interaction.options.getString('mensagem');
    await interaction.reply(msg);
  }
});

client.once('ready', () => {
  console.log(`Bot online: ${client.user.tag}`);
});

client.login(TOKEN);
