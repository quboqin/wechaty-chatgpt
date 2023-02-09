import WhatsApp from 'whatsapp-web.js'
const { Client, LocalAuth } = WhatsApp
import { config as dotenv } from 'dotenv'
dotenv({ path: `.env` })

import { generateQRCode, commandReply } from './utils.js'

let clientOptions = {}

if (process.env.PUPPETEER_LAUNCH_COMMAND === '1') {
  clientOptions.puppeteer = {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  }
}

const client = new Client(clientOptions)

client
  .on('qr', async (qrCode) => generateQRCode(qrCode))
  .on('ready', () => {
    console.log('Client is ready!')
  })
  .on('message', async (message) => {
    console.log(message.body)
    await commandReply(null, message.from, message.body, sendText)
  })

client.initialize()

export async function sendText(target, content) {
  try {
    await client.sendMessage(target, content)
  } catch (e) {
    console.error(e)
  }
}
