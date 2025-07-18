import { CommandCtx } from '../types'
import { MAIN_MENU } from '../consts'
import { getDefaultError } from '../helper'
import { User } from '../models/User'

export const updateDailyLimit = async (ctx: CommandCtx) => {
  if (!ctx.from) {
    console.error('Ошибка при получении данных о пользователе')
    return getDefaultError(ctx)
  }

  const userId = { telegramId: ctx.from.id }
  const user = await User.findOne(userId)
  const dailyLimit = user?.dailyLimit

  if (dailyLimit) {
    await User.findOneAndUpdate(userId, {
      todayRestLimit: dailyLimit,
    })

    // Пока что решил оставить без уведомления, чтобы не надоедать пользователю
    // ctx.reply(`✅ Лимит на сегодня обновлён ${dailyLimit} ккал!`, {
    //   reply_markup: MAIN_MENU
    // })
  }
}