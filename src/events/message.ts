import { client } from '..'
import { MAIN_MENU } from '../consts'
import { getDefaultError } from '../helper'
import { User, UserRoles } from '../models/User'
import { CommandCtx } from '../types'

export const message = async (ctx: CommandCtx) => {
  if (!ctx.from) {
    console.error('Ошибка при получении данных о пользователе')
    return getDefaultError(ctx)
  }

  const userId = { telegramId: ctx.from.id }
  const user = await User.findOne(userId)
  const userRole = user?.role
  const freeAttemptsRest = user?.freeTextAttempts

  if (userRole && [UserRoles.admin, UserRoles.subscriber].includes(userRole) || (userRole === UserRoles.user && Number(freeAttemptsRest) > 0)) {
    const waitingMessage = await ctx.reply('🧐 Надо подумать...')

    const text = ctx.message?.text
    const chatId = Number(ctx.chat?.id)
    const messageId = waitingMessage.message_id

    if (!text) {
      await ctx.reply('Произошла ошибка распознования сообщения')
      throw new Error('Произошла ошибка распознования сообщения')
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "user", content:
          "Представь что ты консультант по тренировкам и правильному питанию." +
          "Отвечай только на вопросы, которые касаются кулинарии и тренировок, если тема другая, то мягко намекни в ответе, что ты консультант по питанию и тренировкам." +
          "Основываясь на этом шаблоне ответь на этот вопрос: '" + text + "'. Оформи со смайликами и без звёздочек."
        },
      ],
    })

    const freeAttemptsRestAfterResponse = Number(freeAttemptsRest) - 1

    if (userRole === UserRoles.user) {
      await User.findOneAndUpdate(userId, {
        freeTextAttempts: freeAttemptsRestAfterResponse,
      })
    }

    await ctx.api.deleteMessage(chatId, messageId)
    await ctx.reply(response.output_text)

    if (userRole === UserRoles.user) {
      const letterCheckedString =
        freeAttemptsRestAfterResponse === 1
          ? `остался ${freeAttemptsRestAfterResponse} пробный текстовый вопрос`
          : `осталось ${freeAttemptsRestAfterResponse} пробных текстовых вопросов`

      await ctx.reply(`У Вас ${letterCheckedString}! ⏳`)
    }

  } else {
    await ctx.reply('У Вас закончились пробные текстовые вопросы😢 Пожалуйста, оформите подписку, чтобы использовать все возможности "Калорийного консультанта" без ограничений', {
      reply_markup: MAIN_MENU,
    })
  }
}