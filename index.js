const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// ===== CONFIGURAÇÃO DO CLIENTE =====
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID; // coloque o ID do seu servidor

// ===== COMANDO /SAY =====
const commands = [
  new SlashCommandBuilder()
    .setName('say')
    .setDescription('Faz o bot falar com embed roxo')
    .addStringOption(option =>
      option.setName('msg')
        .setDescription('Mensagem que o bot vai enviar')
        .setRequired(true))
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

// ===== REGISTRA COMANDO =====
client.once('ready', async () => {
  console.log(`Bot online: ${client.user.tag}`);

  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('Comando /say registrado!');
  } catch (err) {
    console.error('Erro ao registrar comando:', err);
  }
});

// ===== EXECUÇÃO DO COMANDO =====
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'say') {
    const msg = interaction.options.getString('msg');

    // Criando o embed roxo
    const embed = new EmbedBuilder()
      .setColor(0x5865f2) // roxo Discord
      .setTitle('📢 Mensagem do Bot')
      .setDescription(msg)
      .setFooter({ text: `Enviado por ${interaction.user.username}` })
      .setTimestamp();

    // Resposta rápida só pra quem usou o comando
    await interaction.reply({ content: 'Mensagem enviada!', ephemeral: true });

    // Envia o embed no canal
    await interaction.channel.send({ embeds: [embed] });
  }
});

// ===== LOGIN =====
client.login(TOKEN);
