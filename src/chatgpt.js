import { Configuration, OpenAIApi } from 'openai'
import { config as dotenv } from 'dotenv'
dotenv({ path: `.env` })

import { IMAGE_HEIGHT, IMAGE_WIDTH } from './constraint.js'
const MAX_CHATGPT_TOKEN = 2048

import { sendImage, sendText } from './wechat.js'
import { sendText as sendTextToWhatsapp } from './whatsapp.js'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

// For most models, this is 2,048 tokens or about 1,500 words.
// As a rough rule of thumb, 1 token is approximately 4 characters or 0.75 words for English text.
// Pricing is pay-as-you-go per 1,000 tokens, with $18 in free credit that can be used during your first 3 months. Learn more.
export async function chatgptReplyText(isWechat, target, prompt) {
  console.log(`contact: ${target} request: ${prompt}`)
  let response = '🤒 error occurred, please try again later...'
  let result

  try {
    result = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      temperature: 0.6,
      max_tokens: MAX_CHATGPT_TOKEN,
    })
    response = `${prompt} \n ------ \n` + result.data.choices[0].text
  } catch (e) {
    if (!e.message) {
      response = `🤒 ${result.statusText}`
    }
    console.error(e)
  }
  if (isWechat) {
    await sendText(target, response)
  } else {
    await sendTextToWhatsapp(target, response)
  }
}

export async function chatgptReplayImage(target, prompt) {
  let response = '🤒 error occurred, please try again later...'
  let result

  try {
    result = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: `${IMAGE_HEIGHT}x${IMAGE_WIDTH}`,
    })
    let image_url = result.data.data[0].url
    await sendImage(target, null, image_url)
  } catch (e) {
    if (!e.message) {
      response = `🤒 ${result.statusText}`
    }
    console.error(e)
    await sendText(target, response)
  }
}
