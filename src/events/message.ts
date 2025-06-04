import { client } from '..'
import { CommandCtx } from '../types'

export const message = async (ctx: CommandCtx) => {
  await ctx.reply('🧐 Надо подумать...')
  const text = ctx.message?.text
  if (!text) {
    await ctx.reply('Произошла ошибка распознования сообщения')
    throw new Error('Произошла ошибка распознования сообщения')
  }
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      { role: "user", content: text },
    ],
  })

  await ctx.reply(response.output_text)
}