import TelegramBot from 'node-telegram-bot-api'
import { config as dotenv } from 'dotenv'
dotenv({ path: `.env` })

import { commandReply } from './utils.js'

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true })

bot.on('message', async (message) => {
  console.log(message.body)
  await commandReply(null, message.chat.id, message.body, sendText, null)
})

export async function sendText(target, message) {
  try {
    await bot.sendMessage(target, message)
  } catch (e) {
    console.error(e)
  }
}
