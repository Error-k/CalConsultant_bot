import { CommandCtx } from '../types'
import { MAIN_MENU } from '../consts'

export const backToMainMenu = (ctx: CommandCtx) => {
  // Ускорение загрузки
  ctx.answerCallbackQuery()
  
  ctx.callbackQuery?.message?.editText('📷 Отправьте фотографию блюда или продукта мне в сообщения, и я отдам Вам полную информацию о его БЖУ, калорийности и способы сжечь полученные от него калории! 🔥', {
    reply_markup: MAIN_MENU
  })
}