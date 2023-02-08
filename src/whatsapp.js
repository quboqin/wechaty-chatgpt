import WhatsApp from 'whatsapp-web.js'
const { Client, LocalAuth } = WhatsApp
import { config as dotenv } from 'dotenv'
dotenv({ path: `.env` })

import { command_dictionary } from './constraint.js'
import { chatgptReplyText } from './chatgpt.js'
import { generateQRCode } from './utils.js'

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
  command_reply(message.from, message.body)
})

client.initialize()

async function command_reply(contact, content) {
  content = content.trim()
  let lowCaseContent = content.toLowerCase()
  // eslint-disable-next-line no-prototype-builtins
  if (command_dictionary.hasOwnProperty(lowCaseContent)) {
    await sendText(contact, command_dictionary[lowCaseContent])
  }

  if (content.startsWith('/c ')) {
    let prompt = content.replace('/c ', '')
    await chatgptReplyText(false, contact, prompt, sendText)
  }
}

export async function sendText(target, content) {
  try {
    await client.sendMessage(target, content)
  } catch (e) {
    console.error(e)
  }
}
