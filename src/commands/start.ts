import { HELLO_USER_KEYBOARD } from '../consts'
import { getMainMenuReply } from '../helper'
import { User } from '../models/User'
import { CommandCtx, ConversationCtx } from '../types'

export const start = async (ctx: CommandCtx & ConversationCtx) => {
  if (!ctx.from) {
    ctx.reply('Информация о пользователе не доступна')
  }

  const { id, first_name, username } = ctx.from || {}

  try {
    const existingUser = await User.findOne({ telegramId: id })
    if (existingUser) {
      // Пользователь уже зарегистрирован
      return getMainMenuReply(ctx)
    }

    const newUser = new User({
      telegramId: id,
      firstName: first_name,
      username,
      role: 'user',
      freePhotoAttempts: 5,
      freeTextAttempts: 2,
    })
    newUser.save()
    // Успешная регистрация
    return ctx.reply('👋 Приветствую! Перед началом работы с ботом рекомендуется указать свою дневную норму калорий - это позволит использовать функционал Калорийного Консультанта полностью!', {
      reply_markup: HELLO_USER_KEYBOARD,
    })

  } catch (error) {
    console.error('Ошибка регистрации пользователя:', error)
    ctx.reply('Произошла ошибка, мы уже занимаемся этой проблемой 😢')
  }
}