import { ChatGPTAPI } from 'chatgpt'

import { config as dotenv } from 'dotenv'
dotenv({ path: `.env` })

const chatgpt = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY,
  completionParams: {
    temperature: 0.6,
    top_p: 0.8,
  },
})

let followUpId = null
let messageOpt = {}

// return a fix length string end with '...'
function truncate(str, length) {
  if (str.length > length) {
    return str.substring(0, length) + '...'
  }
  return str
}

export async function chatgptReplyText(prompt) {
  console.log(`request: ${prompt}`)
  let response = '🤒 error occurred, please try again later...'
  let result

  if (followUpId) {
    messageOpt.parentMessageId = followUpId
  } else {
    messageOpt = {}
  }
  result = await chatgpt.sendMessage(prompt, messageOpt)
  response = `${truncate(prompt)} \n ---${result.id}--- \n` + result.text
  followUpId = result.id

  return response
}

export function clearParentMessageId() {
  followUpId = null
  console.log(`followUpId is cleared`)
}
