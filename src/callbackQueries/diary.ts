import { InlineKeyboard } from 'grammy'
import { CommandCtx } from '../types'

export const diary = (ctx: CommandCtx) => {
  // Ускорение загрузки
  ctx.answerCallbackQuery()

  const inlineKeyboard = new InlineKeyboard()
    .text('⬅️ Назад в меню', 'backToMainMenu').row()
    .text('Моя дневная норма', 'dailyLimit').row()
    .text('Ещё кнопка', 'button')

  // editText - метод из hydrate для интерактивного меню без захлмаления переписки
  ctx.callbackQuery?.message?.editText('Дневник питания и калькулятор калорий', {
    reply_markup: inlineKeyboard
  })
}