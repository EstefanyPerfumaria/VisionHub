client.once('ready', async () => {
  console.log(`Bot online: ${client.user.tag}`);

  try {
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log('Comando /say registrado!');
  } catch (err) {
    console.error(err);
  }
});
