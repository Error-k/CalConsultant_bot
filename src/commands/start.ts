import { getMainMenuReply } from '../helper'
import { User } from '../models/User'
import { CommandCtx, ConversationCtx } from '../types'

export const start = async (ctx: CommandCtx & ConversationCtx) => {
  if (!ctx.from) {
    ctx.reply('Информация о пользователе не доступна')
  }

  const { id, first_name, username } = ctx.from || {}

  try {
    const existingUser = await User.findOne({telegramId: id})
    if (existingUser) {
      // Пользователь уже зарегистрирован
      return getMainMenuReply(ctx)
    }

    const newUser = new User({
      telegramId: id,
      firstName: first_name,
      username,
    })
    newUser.save()

    // Успешная регистрация
    return getMainMenuReply(ctx)

  } catch (error) {
    console.error('Ошибка регистрации пользователя:', error)
    ctx.reply('Произошла ошибка регистрации, мы уже занимаемся этой проблемой')
  }

}