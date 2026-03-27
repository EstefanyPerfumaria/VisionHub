const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const commands = [
  new SlashCommandBuilder()
    .setName('say')
    .setDescription('Faz o bot falar')
    .addStringOption(option =>
      option.setName('msg')
        .setDescription('Mensagem')
        .setRequired(true))
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

// REGISTRA O COMANDO
client.once('clientReady', async () => {
  console.log(`Bot online: ${client.user.tag}`);

  try {
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands },
    );
    console.log('Comando /say registrado!');
  } catch (error) {
    console.error(error);
  }
});

// EXECUTA O COMANDO
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'say') {
    const msg = interaction.options.getString('msg');
    await interaction.reply(msg);
  }
});

client.login(TOKEN);
