import { Configuration, OpenAIApi } from 'openai'
import { config as dotenv } from 'dotenv'
dotenv({ path: `.env` })

import { sendImage, sendText } from './index.js'
import { IMAGE_HEIGHT, IMAGE_WIDTH } from './constraint.js'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

const MAX_CHATGPT_TOKEN = 2048

// For most models, this is 2,048 tokens or about 1,500 words.
// As a rough rule of thumb, 1 token is approximately 4 characters or 0.75 words for English text.
// Pricing is pay-as-you-go per 1,000 tokens, with $18 in free credit that can be used during your first 3 months. Learn more.
export async function chatgptReplyText(room, contact, request) {
  console.log(`contact: ${contact} request: ${request}`)
  let response = '🤒 error occurred, please try again later...'
  let result

  try {
    result = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: request,
      temperature: 0.6,
      max_tokens: MAX_CHATGPT_TOKEN,
    })
  } catch (e) {
    if (!e.message) {
      response = `🤒 ${result.statusText}`
    }
    console.error(e)
  }
  response = `${request} \n ------ \n` + result.data.choices[0].text
  const target = room || contact
  await sendText(target, response)
}

export async function chatgptReplayImage(room, contact, request) {
  let image_url
  let result
  let response = '🤒 error occurred, please try again later...'
  const target = room || contact

  try {
    result = await openai.createImage({
      prompt: request,
      n: 1,
      size: `${IMAGE_HEIGHT}x${IMAGE_WIDTH}`,
    })
    image_url = result.data.data[0].url
    await sendImage(target, null, image_url)
  } catch (e) {
    if (!e.message) {
      response = `🤒 ${result.statusText}`
    }
    console.error(e)
    await sendText(target, response)
  }
}
