import { Conversation } from "@grammyjs/conversations"
import { COMMAND_NAMES_WITH_SLASH } from "../consts"
import { getDefaultError, getMainMenuReply } from "../helper"
import { CommandCtx } from "../types"
import { User } from "../models/User"

export const enterCaloriesNormConv = async (conversation: Conversation, ctx: CommandCtx) => {
  await ctx.reply("✍️Если Вы уже знаете свою ежедневную норму килокалорий, то введите её цифровым значением без букв и лишних символов, например 1890. Она будет занесена в дневник, и после отправки фотографии блюда в этот чат, Вы сможете одним нажатием вычесть съеденное блюдо из своей нормы!")
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
    await User.findOneAndUpdate(userId, {
      dailyLimit: numberValue,
      todayRestLimit: numberValue,
    })
    await ctx.reply(`✅Задана ежедневная норма калорий: ${message.text} ккал`)
    await getMainMenuReply(ctx)
  } else {
    await ctx.reply(`⚠️Пожалуйста, введите значение целым числом без лишних букв и символов`)
    await enterCaloriesNormConv(conversation, ctx)
  }
}
