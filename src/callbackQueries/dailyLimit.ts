import { InlineKeyboard } from 'grammy'
import { CommandCtx } from '../types'

export const dailyLimit = (ctx: CommandCtx) => {
  // Ускорение загрузки
  ctx.answerCallbackQuery()

  const inlineKeyboard = new InlineKeyboard()
    .text('⬅️ Назад в дневник питания', 'diary').row()
    .text('Узнать свою норму калорий', 'askCaloriesNorm').row()
    .text('Ввести свою норму калорий', 'enterCaloriesNorm').row()
    .text('Остаток калорий на сегодня', 'caloriesRest') // TODO

  // editText - метод из hydrate для интерактивного меню без захлмаления переписки
  ctx.callbackQuery?.message?.editText('Управление своей нормой калорий', {
    reply_markup: inlineKeyboard
  })
}