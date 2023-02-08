import WhatsApp from 'whatsapp-web.js'
const { Client, LocalAuth } = WhatsApp
import { config as dotenv } from 'dotenv'
dotenv({ path: `.env` })

import { generateQRCode, command_reply } from './utils.js'

let clientOptions = {
  authStrategy: new LocalAuth(),
}

if (process.env.PUPPETEER_LAUNCH_COMMAND === '1') {
  clientOptions.puppeteer = {
    args: ['--no-sandbox'],
  }
}

const client = new Client(clientOptions)

client.on('qr', (qrCode) => generateQRCode(qrCode))

client.on('ready', () => {
  console.log('Client is ready!')
})

client.on('message', (message) => {
  console.log(message)
  command_reply(null, message.from, message.body)
})

client.initialize()

export async function sendText(target, content) {
  try {
    await client.sendMessage(target, content)
  } catch (e) {
    console.error(e)
  }
}
