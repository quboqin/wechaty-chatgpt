import { Client, LocalAuth } from 'whatsapp-web.js'
import qrcodeTerminal from 'qrcode-terminal'

import { chatgptReplyText } from './chatgpt.js'

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox'],
  },
})

client
  .on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr)
    qrcodeTerminal.generate(qr, { small: true })
  })
  .on('ready', () => {
    console.log('Client is ready!')
  })
  .on('message', async (message) => {
    const content = message.body
    command_reply(message, content)
  })

client.initialize()

const command_dictionary = {
  ding: 'dong',
  ping: 'pang',
}

async function command_reply(message, content) {
  const target = client
  content = content.trim()
  let lowCaseContent = content.toLowerCase()
  // eslint-disable-next-line no-prototype-builtins
  if (command_dictionary.hasOwnProperty(lowCaseContent)) {
    await sendText(target, command_dictionary[lowCaseContent])
  }

  let prompt

  if (content.startsWith('/c ')) {
    prompt = content.replace('/c ', '')
    await chatgptReplyText(false, target, prompt, message)
  }

  if (content.startsWith('/chatgpt ')) {
    prompt = content.replace('/chatgpt ', '')
    await chatgptReplyText(false, target, prompt, message)
  }
}

export async function sendText(target, message, content) {
  try {
    await target.sendMessage(message.from, content)
  } catch (e) {
    console.error(e)
  }
}
