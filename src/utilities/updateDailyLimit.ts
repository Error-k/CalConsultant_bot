import cron, { ScheduledTask } from "node-cron"
import { getDefaultError } from "../helper"
import { User } from "../models/User"
import { CommandCtx, ConversationCtx } from "../types"

// ДОПИЛИТЬ ФУНКЦИЮ АВТООБНОВЛЕНИЯ ЛИМИТА КАЖДЫЙ ДЕНЬ
export const updateDailyLimit = async (ctx: CommandCtx | ConversationCtx, cronTask?: ScheduledTask) => {
  if (!ctx.from) {
    console.error('Ошибка при получении данных о пользователе')
    return getDefaultError(ctx)
  }

  const userId = { telegramId: ctx.from.id }
  const user = await User.findOne(userId)
  const initialDailyLimit = user?.dailyLimit

  const overwriteDailyLimit = async () => {
    await User.findOneAndUpdate(userId, {
      todayRestLimit: initialDailyLimit,
    })
    await ctx.reply(`✅Ваш остаток калорий на сегодня обнулён: ${initialDailyLimit} ккал`)
  }
  console.log(cronTask)
  if (cronTask && cronTask.getStatus() === 'scheduled') return

  if (initialDailyLimit) {
    // Обновление дневного лимита каждый день в 02:00 МСК
    cronTask = cron.schedule('* * * * *', () => {
      console.log('EVENT!');
      overwriteDailyLimit()
    }, {
      timezone: 'Europe/Moscow'
    })
  } else {
    await ctx.reply(`⚠️ Произошла ошибка обнуления дневного лимта, пожлуйста, отредактируйте остаток калорий на сегодня вручную 😥`)
  }
}