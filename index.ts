import type { Buffer } from 'node:buffer'
import dotenv from 'dotenv'
import type { WebhookPayload } from './types'

dotenv.config()

function generateFormData(payload: WebhookPayload, files?: { buffer: Buffer, filename: string }[]): FormData {
  const formData = new FormData()

  formData.append('payload_json', JSON.stringify(payload))

  if (!files)
    return formData

  for (let i = 0; i < files.length; ++i) {
    const file = files[i]
    const blob = new Blob([file.buffer], { type: 'image/png' })
    formData.append(`files[${i}]`, blob, file.filename)
  }

  return formData
}

async function sendWebhook(payload: WebhookPayload, files?: { buffer: Buffer, filename: string }[]): Promise<void> {
  const webhookUrl = process.env.WEBHOOK_URL

  if (!webhookUrl)
    throw new Error('WEBHOOK_URL is not defined in .env')

  const formData = generateFormData(payload, files)

  await fetch(webhookUrl, {
    body: formData,
    method: 'POST',
  })
}

await sendWebhook({
  content: 'Hello, world!',
  username: 'Webhook',
})
