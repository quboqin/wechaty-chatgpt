import { ChatGPTAPI } from 'chatgpt'

import { config as dotenv } from 'dotenv'
dotenv({ path: `.env` })

import { truncate } from '../utils/index.js'

const chatgpt = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY,
  completionParams: {
    temperature: 0.6,
    top_p: 0.8,
  },
})

let userFollowUpIdMapping = {}

export async function chatgptReplyText(prompt, userId) {
  console.log(`request: ${truncate(prompt)}`)
  let response = '🤒 error occurred, please try again later...'
  let result

  let followUpId = userFollowUpIdMapping[userId] || null

  let messageOpt = {}
  if (followUpId) {
    messageOpt.parentMessageId = followUpId
  }

  result = await chatgpt.sendMessage(prompt, messageOpt)
  response = `${truncate(prompt)} \n ---${result.id}--- \n` + result.text
  followUpId = result.id
  userFollowUpIdMapping[userId] = followUpId

  return response
}

export function clearParentMessageId(userId) {
  delete userFollowUpIdMapping[userId]
  console.log(`${userId} followUpId is cleared`)
}
