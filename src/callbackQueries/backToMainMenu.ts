import { CommandCtx } from '../types'
import { MAIN_MENU } from '../consts'

export const backToMainMenu = (ctx: CommandCtx) => {
  // Ускорение загрузки
  ctx.answerCallbackQuery()
  
  ctx.callbackQuery?.message?.editText('Основное меню📋', {
    reply_markup: MAIN_MENU
  })
}