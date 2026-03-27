const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = "1058207045217685554"; // Substitua pelo ID do seu servidor

// ===== COMANDOS =====
const commands = [
  new SlashCommandBuilder()
    .setName('say')
    .setDescription('Faz o bot falar')
    .addStringOption(option =>
      option.setName('msg')
        .setDescription('Mensagem')
        .setRequired(true))
].map(cmd => cmd.toJSON());

// ===== REGISTRA COMANDOS =====
const rest = new REST({ version: '10' }).setToken(TOKEN);

client.once('ready', async () => { // <-- estava 'clientReady', corrigi para 'ready'
  console.log(`Bot online: ${client.user.tag}`);

  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );
    console.log('Comando /say registrado!');
  } catch (error) {
    console.error(error);
  }
});

// ===== EXECUTA O COMANDO =====
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'say') {
    const msg = interaction.options.getString('msg');

    // Criando o embed roxo
    const embed = new EmbedBuilder()
      .setColor(0x5865f2) // cor roxa
      .setTitle('📢 Mensagem')
      .setDescription(msg)
      .setFooter({ text: `Enviado por ${interaction.user.username}` })
      .setTimestamp();

    // Resposta rápida só pra quem usou o comando
    await interaction.reply({ content: 'Enviado!', ephemeral: true });

    // Envia o embed no canal
    await interaction.channel.send({ embeds: [embed] });
  }
});

// ===== LOGIN =====
client.login(TOKEN);
