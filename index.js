const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = "1058207045217685554";

const commands = [
  new SlashCommandBuilder()
    .setName('regras')
    .setDescription('Enviar regras do servidor')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.once('ready', async () => {
  console.log(`Bot online: ${client.user.tag}`);

  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'regras') {

    const embed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('📜 Regras do Servidor')
      .setDescription('Leia nossas regras e evite problemas.')
      .setImage('https://seulink.com/regras.png')
      .addFields(
        {
          name: '1️⃣ Diretrizes Gerais',
          value:
            '• Siga sempre as Diretrizes da Comunidade do Discord.\n' +
            '• O respeito e a boa convivência são fundamentais.'
        },
        {
          name: '2️⃣ Regras de Chat',
          value:
            '• Respeite todos os membros.\n' +
            '• Sem xingamentos ou ataques.\n' +
            '• Proibido spam.\n' +
            '• Proibido divulgar links sem permissão.\n' +
            '• Use os canais corretamente.\n' +
            '• Não compartilhe informações pessoais.\n' +
            '• Respeite a staff.'
        }
      )
      .setFooter({ text: 'EQP STJ • Regras Oficiais' })
      .setTimestamp();

    await interaction.reply({ content: 'Regras enviadas!', ephemeral: true });
    await interaction.channel.send({ embeds: [embed] });
  }
});

client.login(TOKEN);
