import { FileBox } from 'file-box'
import { config as dotenv } from 'dotenv'
dotenv({ path: `.env` })

import * as fs from 'fs'

let commander = null
fs.readFile('./commander.txt', 'utf-8', (err, data) => {
  commander = data
})

import { generateQRCode, commandReply } from './utils.js'
import { chatgptReplyText } from './chatgpt.js'

// eslint-disable-next-line no-unused-vars
// import { client as discordClient, CHANNEL_ID, MID_JOURNEY_ID } from './discord-bot.js'
import { WechatyBuilder } from 'wechaty'

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
            let result = await chatgptReplyText(content)
            await sendText(room, result)
          }
        } else {
          // just @, without content
          console.log(`@ event emit. room name: ${topic} contact: ${contact} content: ${content}`)
        }
      }
      console.log(`room name: ${topic} contact: ${contact} content: ${content}`)
      await commandReply(room, contact, content)
    } else {
      console.log(`contact: ${contact} content: ${content}`)
      await commandReply(null, contact, content)
    }
  })

wechaty
  .start()
  .then(() => console.log('Start to log in wechat...'))
  .catch((e) => console.error(e))

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
