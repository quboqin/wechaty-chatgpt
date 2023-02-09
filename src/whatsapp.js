import WhatsApp from 'whatsapp-web.js'
const { Client, LocalAuth, MessageMedia } = WhatsApp
import { config as dotenv } from 'dotenv'
dotenv({ path: `.env` })

import { generateQRCode, commandReply } from './utils.js'

let clientOptions = {}

if (process.env.PUPPETEER_LAUNCH_COMMAND === '1') {
  clientOptions.puppeteer = {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  }
}

console.log(
  `PUPPETEER_LAUNCH_COMMAND = ${process.env.PUPPETEER_LAUNCH_COMMAND},clientOptions = ${JSON.stringify(clientOptions)}`,
)

const client = new Client(clientOptions)

client
  .on('qr', async (qrCode) => generateQRCode(qrCode))
  .on('ready', () => {
    console.log('Client is ready!')
  })
  .on('message', async (message) => {
    console.log(message.body)
    await commandReply(null, message.from, message.body, sendText, sendImage)
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
    media.filename = 'CustomImageName.png'
    await client.sendMessage(target, media)
  } catch (e) {
    console.error(e)
  }
}
