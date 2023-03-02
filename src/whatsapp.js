import WhatsApp from 'whatsapp-web.js'
import { config as dotenv } from 'dotenv'
dotenv({ path: `.env` })

import { chatgptReplyText, clearParentMessageId } from './api/chatgpt.js'
import { openaiReplayImage } from './api/openai.js'
import { generateQRCode, commandReply } from './service/core-service.js'

const { Client, LocalAuth, MessageMedia } = WhatsApp

let clientOptions = {}

if (process.env.WHATSAPP_AUTH === 'LocalAuth') {
  clientOptions.authStrategy = new LocalAuth()
}

if (process.env.PUPPETEER === 'prod') {
  clientOptions.puppeteer = {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  }
}

const client = new Client(clientOptions)

client
  .on('qr', async (qrCode) => generateQRCode(qrCode))
  .on('ready', () => {
    console.log('whatsapp client is ready!')
  })
  .on('message', async (message) => {
    console.log(message.body)
    await commandReply(
      null,
      message.from,
      message.body,
      chatgptReplyText,
      clearParentMessageId,
      openaiReplayImage,
      sendText,
      sendImage,
    )
  })

client.initialize()

export async function sendText(target, content) {
  try {
    await client.sendMessage(target, content)
  } catch (e) {
    console.error(e)
  }
}

export async function sendImage(target, base64String, imageUrl) {
  try {
    const media = await MessageMedia.fromUrl(imageUrl)
    media.mimetype = 'image/png'
    media.filename = 'image.png'
    await client.sendMessage(target, media)
  } catch (e) {
    console.error(e)
  }
}
