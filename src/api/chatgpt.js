import fetch from 'unfetch'
import { ChatGPTAPI } from 'chatgpt'

import { config as dotenv } from 'dotenv'
dotenv({ path: `.env` })

const chatgpt = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY,
  completionParams: {
    temperature: 0.6,
    top_p: 0.8,
  },
  fetch: fetch,
})

let followUpId = null
let messageOpt = {}

export async function chatgptReplyText(prompt) {
  console.log(`request: ${prompt}`)
  let response = '🤒 error occurred, please try again later...'
  let result

  if (followUpId) {
    messageOpt.parentMessageId = followUpId
  }
  result = await chatgpt.sendMessage(prompt, messageOpt)
  response = `${prompt} \n ------ \n` + result.text
  followUpId = result.id

  return response
}

export function clearParentMessageId() {
  followUpId = null
}
