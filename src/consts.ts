import { InlineKeyboard } from 'grammy'

export const BOT_API_KEY = process.env.BOT_API_KEY

export const COMMANDS = [
  {
    command: 'start',
    description: 'Запуск бота',
  },
  {
    command: 'menu',
    description: 'Главное меню',
  },
  {
    command: 'subscribe',
    description: 'Оформить подписку',
  }
]
export const COMMAND_NAMES = COMMANDS.map((command) => command.command)
export const COMMAND_NAMES_WITH_SLASH = COMMANDS.map((command) => '/' + command.command)

// Основное меню
export const MAIN_MENU = new InlineKeyboard()
  .text('Руководство', 'management')
  .text('⭐️ Оформить подписку', 'subscribe').row()
  .text('👤 Мой дневник', 'diary')
  .text('Остались вопросы?', 'questions')

export const DAILY_LIMIT_KEYBOARD = new InlineKeyboard()
  .text('⬅️ Назад в дневник питания', 'diary').row()
  .text('Узнать свою норму калорий', 'askCaloriesNorm').row()
  .text('Ввести свою норму калорий', 'enterCaloriesNorm').row()
  .text('Остаток калорий на сегодня', 'caloriesRest').row()
  .text('Вычесть из сегодняшнего лимита', 'subtractCalories').row()
  .text('Сбросить ежедневный лимит (наступил новый день)', 'updateDailyLimit')

export const GENDERS = ["М", "Ж"]