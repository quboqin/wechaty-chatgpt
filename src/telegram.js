import { config as dotenv } from 'dotenv'
dotenv({ path: `.env` })

import { chatgptReplyText, clearParentMessageId } from './api/chatgpt.js'
import { openaiReplayImage } from './api/openai.js'
import { commandReply } from './service/core-service.js'

import TelegramBot from 'node-telegram-bot-api'

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true })

console.log('start telegram bot...')

bot.on('message', async (message) => {
  console.log(message.text.toString())
  await commandReply(
    null,
    message.chat.id,
    message.text.toString(),
    chatgptReplyText,
    clearParentMessageId,
    openaiReplayImage,
    sendText,
    sendImage,
  )
})

export async function sendText(target, message) {
  try {
    await bot.sendMessage(target, message)
  } catch (e) {
    console.error(e)
  }
}

export async function sendImage(target, base64String, imageUrl) {
  try {
    await bot.sendPhoto(target, imageUrl, { caption: 'this is a photo' })
  } catch (e) {
    console.error(e)
  }
}
