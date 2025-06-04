import { CommandCtx } from '../types'
import { DAILY_LIMIT_KEYBOARD } from '../consts'

export const dailyLimit = (ctx: CommandCtx) => {
  // Ускорение загрузки
  ctx.answerCallbackQuery()

  // editText - метод из hydrate для интерактивного меню без захлмаления переписки
  ctx.callbackQuery?.message?.editText('Управление своей нормой калорий', {
    reply_markup: DAILY_LIMIT_KEYBOARD
  })
}