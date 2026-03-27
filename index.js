const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// ===== CONFIGURAÇÃO DO BOT =====
const TOKEN = "SEU_TOKEN_AQUI";         // Coloque o token do seu bot
const CLIENT_ID = "SEU_CLIENT_ID_AQUI"; // Coloque o ID do seu bot
const GUILD_ID = "SEU_GUILD_ID_AQUI";   // Coloque o ID do seu servidor

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
client.once('clientReady', async () => { // Corrigido para v15+
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

    // Criando o embed roxo
    const embed = new EmbedBuilder()
      .setColor(0x5865f2) // 💜 roxo Discord
      .setTitle('VisionHub ☯')
      .setDescription(msg)
      .setFooter({ text: `Enviado por ${interaction.user.username}` })
      .setTimestamp();

    // Resposta invisível só pra quem usou o comando
    await interaction.reply({ content: 'Mensagem enviada!', ephemeral: true });

    // Envia o embed no canal
    await interaction.channel.send({ embeds: [embed] });
  }
});

// ===== LOGIN =====
client.login(TOKEN);
