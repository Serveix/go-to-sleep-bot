require('dotenv').config()
const { Client, GatewayIntentBits } = require('discord.js');
const moment = require('moment-timezone');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ] });
let mainChannel = null
const kickableGuildMembers = []

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const allChannels = await client.channels.cache;

  for (const ch of allChannels.values()) {
    if (ch.name === 'general' && ch.type === 0) { // type = 0 is text
        console.log("Main channel is: ", ch.name, ch.id)
        mainChannel = ch
        
        break
    }
  }
});

client.on('messageCreate', message => {
    if (message.author.bot) return

    if (message.content === '/melatonin activate') {
        kickableGuildMembers.push(message.member)
        console.log("Kickable members: ", kickableGuildMembers.map(m => m.user.username))
    }
})

setInterval(async () => {
    if (mainChannel === null) {
        return
    }

    const now = moment().utc();
    const hours = now.tz('America/Monterrey').hours()
    
    if (hours >= 22 || hours < 6) {
        for (const guildMember of kickableGuildMembers) {
            if (guildMember.voice.channel) {
                console.log(`${guildMember.user.tag} is connected to ${guildMember.voice.channel.name}!`);
                mainChannel.send('Buenas noches, ' + guildMember.user.username + ' 🌚')
                guildMember.voice.disconnect()
            }
        }
    }

}, 5000)

client.login(process.env.DISCORD_BOT_TOKEN);