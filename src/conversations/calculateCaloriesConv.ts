import { Conversation } from "@grammyjs/conversations"
import { CommandCtx } from "../types"
import { COMMAND_NAMES_WITH_SLASH, DAILY_LIMIT_KEYBOARD } from "../consts"
import { getDefaultError, getMainMenuReply } from "../helper"
import { User } from "../models/User"

export const calculateCaloriesConv = async (conversation: Conversation, ctx: CommandCtx) => {
  await ctx.reply("✍️Основываясь на информации выше, впишите, пожалуйста, количество килокалорий, которое вы хотите вычесть из дневного лимита:")
  const { message } = await conversation.waitFor("message:text")

  // Выход из диалога, если пользователь отправляет любую комманду
  if (COMMAND_NAMES_WITH_SLASH.includes(message.text)) {
    getMainMenuReply(ctx)
    await conversation.halt()
  }

  const numberValue = Number(message.text)
  if (Boolean(numberValue) && numberValue > 0) {
    if (!ctx.from) {
      console.error('Ошибка при получении данных о пользователе')
      return getDefaultError(ctx)
    }
    const userId = { telegramId: ctx.from.id }
    const user = await User.findOne(userId)
    const initialDailyLimit = user?.todayRestLimit
    
    if (initialDailyLimit) {
      const todayRestLimit = Number(initialDailyLimit) - numberValue
      await User.findOneAndUpdate(userId, {
        todayRestLimit: todayRestLimit,
      })
      await ctx.reply(`✅Ваш остаток калорий на сегодня: ${todayRestLimit} ккал`)
    } else {
      ctx.reply('Для начала Вам нужно задать свою дневную норму калорий:', {
        reply_markup: DAILY_LIMIT_KEYBOARD,
      })
    }
  } else {
    await ctx.reply(`⚠️Пожалуйста, введите значение целым числом без лишних букв и символов`)
    await calculateCaloriesConv(conversation, ctx)
  }
}