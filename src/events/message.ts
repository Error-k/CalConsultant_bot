import { client } from '..'
import { CommandCtx } from '../types'

export const message = async (ctx: CommandCtx) => {
  const text = ctx.message?.text
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      { role: "user", content: text },
    ],
  })

  await ctx.reply(response.output_text)
}