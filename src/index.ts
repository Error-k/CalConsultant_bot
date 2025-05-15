import { hydrate } from '@grammyjs/hydrate'
import 'dotenv/config'
import OpenAI from 'openai'
import { Bot } from 'grammy'

import { backToMainMenu, dailyLimit, diary, enterCaloriesNorm, questions, userAgreement } from './callbackQueries'
import { start } from './commands'
import { BOT_API_KEY } from './consts'
import { message, photo } from './events'
import { getErrorCatch, getMainMenuReply, startBot } from './helper'
import { conversations, createConversation } from '@grammyjs/conversations'
import { CommandCtx, ConversationCtx } from './types'
import { enterCaloriesNormConv } from './conversations'
import { askCaloriesNormConv } from './conversations/askCaloriesNormConv'
import { askCaloriesNorm } from './callbackQueries/askCaloriesNorm'

if (!BOT_API_KEY) {
  throw new Error('BOT_API_KEY is not defined')
}
// Инициализация бота
export const bot = new Bot<CommandCtx & ConversationCtx>(BOT_API_KEY)
// Подключение hydrate для интерактивного меню (редактирование предыдущего сообщения с заменой на новое)
bot.use(hydrate()).use(conversations())

// Регистрация диалогов
// --- beginning
bot.use(createConversation(askCaloriesNormConv))
bot.use(createConversation(enterCaloriesNormConv))
// --- ending

// Инициализация клиента для нейронки
export const client = new OpenAI()

// Меню команд
bot.api.setMyCommands([
  {
    command: 'start',
    description: 'Запуск бота',
  },
  {
    command: 'menu',
    description: 'Главное меню',
  }
])

// Обработка команд
// --- beginning
bot.command('start', async (ctx) => start(ctx))

// Клавиатура в сообщениях бота
bot.command('menu', async (ctx) => {
  await getMainMenuReply(ctx)
})
// --- ending

// Обработка нажатий по кнопкам инлайн меню
// --- beginning
bot.callbackQuery('questions', questions)
bot.callbackQuery('backToMainMenu', backToMainMenu)
bot.callbackQuery('userAgreement', userAgreement)
bot.callbackQuery('diary', diary)
bot.callbackQuery('dailyLimit', dailyLimit)
bot.callbackQuery('enterCaloriesNorm', enterCaloriesNorm)
bot.callbackQuery('askCaloriesNorm', askCaloriesNorm)
// --- ending

// Обработка любого сообщения с прикреплённым фото
bot.on(":photo", async (ctx) => photo(ctx))

// Обработка любого текстового сообщения
bot.on('message', async (ctx) => message(ctx))

// Обработка ошибок
bot.catch((error) => getErrorCatch(error))

startBot()
