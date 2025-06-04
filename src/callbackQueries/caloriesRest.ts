import { CommandCtx } from '../types'
import { MAIN_MENU } from '../consts'
import { getDefaultError } from '../helper'
import { User } from '../models/User'

export const caloriesRest = async (ctx: CommandCtx) => {
  // Ускорение загрузки
  ctx.answerCallbackQuery()

  if (!ctx.from) {
    console.error('Ошибка при получении данных о пользователе')
    return getDefaultError(ctx)
  }

  const userId = { telegramId: ctx.from.id }
  const user = await User.findOne(userId)
  const todayCaloriesRest = user?.todayRestLimit

  ctx.callbackQuery?.message?.editText(`📅 Ваш остаток на сегодня ${todayCaloriesRest} ккал`, {
    reply_markup: MAIN_MENU
  })
}