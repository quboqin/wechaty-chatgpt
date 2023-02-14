import qrcodeTerminal from 'qrcode-terminal'

import { command_dictionary } from './constraint.js'

import { chatgptReplyText, chatgptReplayImage } from './chatgpt.js'

export async function generateQRCode(qrcode) {
  await qrcodeTerminal.generate(qrcode, { small: true })
  const qrcodeImageUrl = ['https://api.qrserver.com/v1/create-qr-code/?data=', encodeURIComponent(qrcode)].join('')
  console.log(qrcodeImageUrl)
}

export async function commandReply(room, contact, content, sendText, sendImage) {
  const target = room || contact
  content = content.trim()
  let lowCaseContent = content.toLowerCase()
  // eslint-disable-next-line no-prototype-builtins
  if (command_dictionary.hasOwnProperty(lowCaseContent)) {
    await sendText(target, command_dictionary[lowCaseContent])
  }

  let prompt, result

  if (content.startsWith('/c ')) {
    prompt = content.replace('/c ', '')
    result = await chatgptReplyText(prompt)
    await sendText(target, result)
  }

  if (content.startsWith('/i ')) {
    prompt = content.replace('/i ', '')
    result = await chatgptReplayImage(prompt)
    await sendImage(target, null, result.imageUrl)
  }
}
