import { Conversation } from "@grammyjs/conversations"
import { COMMAND_NAMES_WITH_SLASH, MAIN_MENU } from "../consts"
import { getDefaultError, getMainMenuReply } from "../helper"
import { CommandCtx } from "../types"
import { User } from "../models/User"

export const subtractCaloriesConv = async (conversation: Conversation, ctx: CommandCtx) => {
  await ctx.reply("✍️Если Вы употребили какое-то количество килокалорий без отправки фотографии в бота, то введите это количество целым числом без лишних символов и букв, оно будет вычтено из текущего дневного лимита!")
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
    const userId = { telegramId: ctx.from.id}
    const user = await User.findOne(userId)
    const todayRestLimit = user?.todayRestLimit
    if (todayRestLimit) {
      const subtractedLimit = todayRestLimit - numberValue
      await User.findOneAndUpdate(userId, {
        todayRestLimit: subtractedLimit,
      })
      await ctx.reply(`✅Остаток килокалорий на сегодня обновлен: ${subtractedLimit} ккал!`, {
        reply_markup: MAIN_MENU
      })
    } else {
      await ctx.reply(`⚠️Пожалуйста, сначала задайте свою дневную норму с помощью меню дневника!`)
    }
  } else {
    await ctx.reply(`⚠️Пожалуйста, введите значение целым числом без лишних букв и символов`)
    await subtractCaloriesConv(conversation, ctx)
  }
}