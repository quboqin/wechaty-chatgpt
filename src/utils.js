import qrcodeTerminal from 'qrcode-terminal'

import { command_dictionary } from './constraint.js'

import { chatgptReplyText, chatgptReplayImage } from './chatgpt.js'
import { getFlagStudioToken, flagStudioReplayImage } from './flagstudio.js'

await getFlagStudioToken()

export async function generateQRCode(qrcode) {
  await qrcodeTerminal.generate(qrcode, { small: true })
  const qrcodeImageUrl = ['https://api.qrserver.com/v1/create-qr-code/?data=', encodeURIComponent(qrcode)].join('')
  console.log(qrcodeImageUrl)
}

export async function command_reply(room, contact, content, sendText, sendImage) {
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
    await sendImage(target, null, result.image_url)
  }

  if (content.startsWith('/f ')) {
    const request = content.replace('/f ', '')
    const messageArray = request.split(',')
    prompt = messageArray[0]
    const style = messageArray[1]
    result = await flagStudioReplayImage(target, prompt, style)
    await sendImage(target, result.base64String, null)
  }

  if (content.startsWith('/m ')) {
    prompt = content.replace('/m ', '')
    await sendMessageToDiscord(prompt)
  }
}

// eslint-disable-next-line no-unused-vars
async function sendMessageToDiscord(prompt) {
  // const channel = await discordClient.channels.fetch(CHANNEL_ID)
  // if (channel) {
  //   channel.send(`/imagine prompt ${prompt}`)
  // }
  // const user = await discordClient.users.fetch(MID_JOURNEY_ID)
  // console.log(`user = ${user}`)
  // if (user) {
  //   user.send(`/imagine ${prompt}`)
  // }
}
