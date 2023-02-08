import { FileBox } from 'file-box'
import { config as dotenv } from 'dotenv'
dotenv({ path: `.env` })

import * as fs from 'fs'

let commander = null
fs.readFile('./commander.txt', 'utf-8', (err, data) => {
  commander = data
})

import { command_dictionary } from './constraint.js'
import { generateQRCode } from './utils.js'

// eslint-disable-next-line no-unused-vars
// import { client as discordClient, CHANNEL_ID, MID_JOURNEY_ID } from './discord-bot.js'
import { WechatyBuilder } from 'wechaty'
import { chatgptReplyText, chatgptReplayImage } from './chatgpt.js'
import { getFlagStudioToken, flagStudioReplayImage } from './flagstudio.js'

await getFlagStudioToken()

const wechaty = WechatyBuilder.build({
  name: 'wechaty-chatgpt',
  puppet: 'wechaty-puppet-padlocal',
  puppetOptions: {
    token: process.env.PADLOCAL_TOKEN,
  },
})

wechaty
  // eslint-disable-next-line no-unused-vars
  .on('scan', async (qrcode) => await generateQRCode(qrcode))
  .on('login', (user) => console.log(`User ${user} logged in`))
  .on('logout', (user) => console.log(`User ${user} has logged out`))
  .on('room-invite', async (roomInvitation) => {
    try {
      console.log(`received room-invite event.`)
      await roomInvitation.accept()
    } catch (e) {
      console.error(e)
    }
  })
  .on('room-join', async (room, inviteeList, inviter) => {
    console.log(`received ${inviter} ${room} room-join event `)
    await sendText(room, commander)
  })
  .on('friendship', async (friendship) => {
    console.log(`received friend event from ${friendship.contact().name()}, messageType: ${friendship.type()}`)
  })
  .on('message', async (message) => {
    const contact = message.talker()
    const receiver = message.listener()
    let content = message.text()
    const room = message.room()
    const isText = message.type() === wechaty.Message.Type.Text
    if (!isText) {
      return
    }
    if (room) {
      const topic = await room.topic()
      if (await message.mentionSelf()) {
        let receiverName = ''
        if (receiver) {
          const alias = await room.alias(receiver)
          receiverName = alias || receiver.name()
        }
        const groupContent = content.replace(`@${receiverName}`, '')
        console.log(`groupContent:${groupContent}`)
        if (groupContent) {
          content = groupContent.trim()
          if (!content.startsWith('/c')) {
            await chatgptReplyText(true, room, content, sendText)
          }
        } else {
          // just @, without content
          console.log(`@ event emit. room name: ${topic} contact: ${contact} content: ${content}`)
        }
      }
      console.log(`room name: ${topic} contact: ${contact} content: ${content}`)
      command_reply(room, contact, content)
    } else {
      console.log(`contact: ${contact} content: ${content}`)
      command_reply(null, contact, content)
    }
  })

wechaty
  .start()
  .then(() => console.log('Start to log in wechat...'))
  .catch((e) => console.error(e))

async function command_reply(room, contact, content) {
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

export async function sendImage(target, base64String, imageUrl) {
  const fileBox = base64String ? FileBox.fromBase64(base64String, 'image.jpg') : FileBox.fromUrl(imageUrl)

  try {
    await target.say(fileBox)
  } catch (e) {
    console.error(e)
  }
}

export async function sendText(target, message) {
  try {
    await target.say(message)
  } catch (e) {
    console.error(e)
  }
}
