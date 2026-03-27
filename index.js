const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// ===== CONFIGURAÇÃO DO BOT =====
const TOKEN = "MTQ4Njk2MTAzNTU3NDUwOTY0OA.GVxzSC.sd6gyT5TQ7HDB4rvZYLTcm0_zzY_JeRLMp_Sx8"; 
const CLIENT_ID = "1486961035574509648"; 
const GUILD_ID = "1058207045217685554"; // Substitua pelo ID do seu servidor

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// ===== COMANDO /SAY =====
const commands = [
  new SlashCommandBuilder()
    .setName('say')
    .setDescription('Faz o bot enviar uma mensagem em embed roxo')
    .addStringOption(option =>
      option.setName('msg')
        .setDescription('Mensagem que o bot vai enviar')
        .setRequired(true)
    )
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

// ===== REGISTRA COMANDOS =====
client.once('clientReady', async () => {
  console.log(`Bot online: ${client.user.tag}`);

  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('Comando /say registrado com sucesso!');
  } catch (err) {
    console.error('Erro ao registrar comando:', err);
  }
});

// ===== EXECUTA O COMANDO =====
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'say') {
    const msg = interaction.options.getString('msg');

    const embed = new EmbedBuilder()
      .setColor(0x5865f2) // 💜 roxo Discord
      .setTitle('📢 Mensagem do Bot')
      .setDescription(msg)
      .setFooter({ text: `Enviado por ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ content: 'Mensagem enviada!', ephemeral: true });
    await interaction.channel.send({ embeds: [embed] });
  }
});

// ===== LOGIN =====
client.login(TOKEN);
