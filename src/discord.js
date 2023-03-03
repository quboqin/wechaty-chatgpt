import fs from 'fs'
import { config as dotenv } from 'dotenv'
dotenv({ path: `.env` })

import discord from 'discord.js'
const { Client, GatewayIntentBits } = discord

const QUBO_ID = '450851527364575244'
const MID_JOURNEY_ID = '936929561302675456'
const CHANNEL_ID = '1066898073223172118'

// add midjourney to my server
// https://www.followchain.org/add-midjourney-bot-discord-server/

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
})

// https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-
client.once('ready', async () => {
  console.log(`bot is online`)
  const user = await client.users.fetch(QUBO_ID)
  console.log(`user = ${user}`)
  if (user) {
    user.send(`hello ${user.username}`)
  }

  const channel = await client.channels.fetch(CHANNEL_ID)
  console.log(`channel = ${channel}`)
  if (channel) {
    channel.send(`hello everyone in ${channel.name}`)
  }
})

// https://stackoverflow.com/questions/73036854/message-content-doesnt-have-any-value-in-discord-js
client.on('messageCreate', async (message) => {
  console.log(message.content)
  if (message.content === 'ping') {
    message.reply('pong')
  }
  const attachment = message.attachments.first()
  if (attachment && /\.(png|jpe?g|svg)$/.test(attachment.url)) {
    console.log(attachment.url)
    fetch(attachment.url)
      .then((res) => res.buffer())
      .then((buffer) => {
        fs.writeFileSync(`./output/${attachment.name}`, buffer)
      })
  }
})

client.login(process.env.DISCORD_TOKEN)

export { client, CHANNEL_ID, MID_JOURNEY_ID }
