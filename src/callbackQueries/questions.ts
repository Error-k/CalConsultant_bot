import { InlineKeyboard } from 'grammy'
import { CommandCtx } from '../types'

export const questions = (ctx: CommandCtx) => {
  // Ускорение загрузки
  ctx.answerCallbackQuery()

  const inlineKeyboard = new InlineKeyboard()
    .text('⬅️ Назад в меню', 'backToMainMenu').row()
    .url('Чат с поддержкой', String(process.env.SUPPORT_CHAT_URL)).row()
    .text('Пользовательское соглашение', 'userAgreement')

  // editText - метод из hydrate для интерактивного меню без захлмаления переписки
  ctx.callbackQuery?.message?.editText('Техническая поддержка', {
    reply_markup: inlineKeyboard
  })
}