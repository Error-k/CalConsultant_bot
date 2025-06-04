import { ScheduledTask } from 'node-cron'
import { getMainMenuReply } from '../helper'
import { User } from '../models/User'
import { CommandCtx, ConversationCtx } from '../types'
// import { updateDailyLimit } from '../utilities/updateDailyLimit'

// ДОПИЛИТЬ updateDailyLimit
export const start = async (ctx: CommandCtx & ConversationCtx, cronTask?: ScheduledTask) => {
  if (!ctx.from) {
    ctx.reply('Информация о пользователе не доступна')
  }

  const { id, first_name, username } = ctx.from || {}

  try {
    const existingUser = await User.findOne({ telegramId: id })
    if (existingUser) {
      // Пользователь уже зарегистрирован
      // updateDailyLimit(ctx, cronTask)
      return getMainMenuReply(ctx)
    }

    const newUser = new User({
      telegramId: id,
      firstName: first_name,
      username,
      role: 'user',
      freeAttempts: 5,
    })
    newUser.save()
    // updateDailyLimit(ctx, cronTask)
    // Успешная регистрация
    return getMainMenuReply(ctx)

  } catch (error) {
    console.error('Ошибка регистрации пользователя:', error)
    ctx.reply('Произошла ошибка регистрации, мы уже занимаемся этой проблемой')
  }

}