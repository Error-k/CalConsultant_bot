import { InlineKeyboard } from 'grammy'

export const BOT_API_KEY = process.env.BOT_API_KEY

// Основное меню
export const MAIN_MENU = new InlineKeyboard()
  .text('Руководство', 'management')
  .text('⭐️ Оформить подписку', 'subscribe').row()
  .text('👤 Мой дневник', 'diary')
  .text('Остались вопросы?', 'questions')

export const GENDERS = ["М", "Ж"]