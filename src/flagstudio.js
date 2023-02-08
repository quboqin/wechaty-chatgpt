import axios from 'axios'
import { config as dotenv } from 'dotenv'
dotenv({ path: `.env` })

import { IMAGE_HEIGHT, IMAGE_WIDTH } from './constraint.js'

const instance = axios.create({
  baseURL: 'https://flagopen.baai.ac.cn/flagStudio',
  timeout: 1000 * 60,
  headers: { Accept: 'application/json' },
})

export let flag_Studio_token

export async function getFlagStudioToken() {
  flag_Studio_token = (
    await instance.get('/auth/getToken', {
      params: {
        apikey: process.env.FLAG_STUDIO_KEY,
      },
    })
  ).data.data.token

  console.log(`flag_Studio_token = ${flag_Studio_token}`)
}

export async function flagStudioReplayImage(prompt, style) {
  let response
  let base64String
  let result

  console.log(`flagstudio received: prompt = ${prompt}, style = ${style}`)

  try {
    result = await instance.post(
      'v1/text2img',
      {
        prompt: prompt,
        style: style,
        guidance_scale: 7.5,
        height: IMAGE_HEIGHT,
        width: IMAGE_WIDTH,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          token: flag_Studio_token,
        },
      },
    )

    base64String = result.data.data
  } catch (e) {
    if (!e.message) {
      response = `🤒 ${result.statusText}`
    }
    console.error(e)
  }

  return {
    response,
    base64String,
  }
}
