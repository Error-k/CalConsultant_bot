import { client } from '..'
import { CommandCtx } from '../types'

export const photo = async (ctx: CommandCtx) => {
  const photo = await ctx.getFile()
  const path = photo.file_path;
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "user",
        content:
        "Проанализируй картинку. Если это не еда, не блюдо или не продукт, то напиши в ответе 'Пожалуйста, пришлите фотографию блюда'." +
        "Если это еда, блюдо или продукт, то напиши название этого блюда или продукта. Напиши его БЖУ, калорийность как на 100г, так и на целую стандартную порцию" +
        "и способы сжечь набранные калории после употребления этого блюда или продукта. Оформи со смайликами и без звёздочек. ",
      },
      {
        role: "user",
        content: [
          {
            type: "input_image", 
            image_url: `https://api.telegram.org/file/bot${process.env.BOT_API_KEY}/${path}`,
          }
        ],
      },
    ],
  })
  
  await ctx.reply(response.output_text)
}