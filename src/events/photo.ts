import { InlineKeyboard } from 'grammy';
import { client } from '..'
import { CommandCtx } from '../types'
import { getDefaultError } from '../helper';
import { MAIN_MENU } from '../consts';
import { User, UserRoles } from '../models/User';

export const photo = async (ctx: CommandCtx) => {
  if (!ctx.from) {
    console.error('Ошибка при получении данных о пользователе')
    return getDefaultError(ctx)
  }

  const userId = { telegramId: ctx.from.id }
  const user = await User.findOne(userId)
  const userRole = user?.role
  const freeAttemptsRest = user?.freePhotoAttempts

  if (userRole && [UserRoles.admin, UserRoles.subscriber].includes(userRole) || (userRole === UserRoles.user && Number(freeAttemptsRest) > 0)) {
    const waitingMessage = await ctx.reply('👀 Рассматриваю фотографию...')

    const chatId = Number(ctx.chat?.id)
    const messageId = waitingMessage.message_id

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
          "и способы сжечь набранные калории после употребления этого блюда или продукта. Оформи со смайликами и без звёздочек.",
        },
        {
          role: "user",
          content: [
            {
              type: "input_image",
              image_url: `https://api.telegram.org/file/bot${process.env.BOT_API_KEY}/${path}`,
              detail: "auto",
            }
          ],
        },
      ],
    })

    const freeAttemptsRestAfterResponse = Number(freeAttemptsRest) - 1

    if (userRole === UserRoles.user) {
      await User.findOneAndUpdate(userId, {
        freePhotoAttempts: freeAttemptsRestAfterResponse,
      })
    }

    const inlineKeyboard = new InlineKeyboard()
      .text('✏️ Вычесть из дневного лимита', 'calculateCalories')

    await ctx.api.deleteMessage(chatId, messageId)
    await ctx.reply(response.output_text, {
      reply_markup: inlineKeyboard,
    })

    if (userRole === UserRoles.user) {
      const letterCheckedString =
        freeAttemptsRestAfterResponse === 1
          ? `остался ${freeAttemptsRestAfterResponse} пробный фото-вопрос`
          : `осталось ${freeAttemptsRestAfterResponse} пробных фото-вопросов`

      await ctx.reply(`У Вас ${letterCheckedString}! ⏳`)
    }
    
  } else {
    await ctx.reply('У Вас закончились пробные фото-вопросы😢 Пожалуйста, оформите подписку, чтобы использовать все возможности "Калорийного консультанта" без ограничений', {
      reply_markup: MAIN_MENU,
    })
  }
}