import { hydrate } from '@grammyjs/hydrate'
import 'dotenv/config'
import OpenAI from 'openai'
import { Bot } from 'grammy'

import {
  askCaloriesNorm,
  backToMainMenu,
  calculateCalories,
  caloriesRest,
  dailyLimit,
  diary,
  enterCaloriesNorm,
  questions,
  subtractCalories,
  updateDailyLimit,
  userAgreement,
} from './callbackQueries'
import { start, subscribe, onSuccessPayment } from './commands'
import { BOT_API_KEY, COMMANDS } from './consts'
import { message, photo } from './events'
import { getErrorCatch, getMainMenuReply, startBot } from './helper'
import { conversations, createConversation } from '@grammyjs/conversations'
import { CommandCtx, ConversationCtx } from './types'
import {
  askCaloriesNormConv,
  calculateCaloriesConv,
  enterCaloriesNormConv,
  subtractCaloriesConv,
} from './conversations'
// import { ScheduledTask } from 'node-cron'

if (!BOT_API_KEY) {
  throw new Error('BOT_API_KEY is not defined')
}
// Инициализация бота
export const bot = new Bot<CommandCtx & ConversationCtx>(BOT_API_KEY)

// Подтверждение транзакций ботом
bot.on('pre_checkout_query', (ctx) => {
  ctx.answerPreCheckoutQuery(true)
})

// Подключение hydrate для интерактивного меню (редактирование предыдущего сообщения с заменой на новое)
bot.use(hydrate()).use(conversations())

// Регистрация диалогов
// --- beginning
//@ts-ignore
bot.use(createConversation(askCaloriesNormConv))
//@ts-ignore
bot.use(createConversation(enterCaloriesNormConv))
//@ts-ignore
bot.use(createConversation(calculateCaloriesConv))
//@ts-ignore
bot.use(createConversation(subtractCaloriesConv))
// --- ending

// Обработка успешного платежа
bot.on(':successful_payment', onSuccessPayment)

// Инициализация клиента для нейронки
export const client = new OpenAI()

// let cronTask: ScheduledTask | undefined

// Меню команд
bot.api.setMyCommands(COMMANDS)

// Обработка команд
// --- beginning
bot.command('start', async (ctx) => start(ctx))

// Клавиатура в сообщениях бота
bot.command('menu', async (ctx) => {
  await getMainMenuReply(ctx)
})

// Оформить подписку из меню команд
bot.command('subscribe', subscribe)
// --- ending


// Обработка нажатий по кнопкам инлайн меню
// --- beginning
bot.callbackQuery('askCaloriesNorm', askCaloriesNorm)
bot.callbackQuery('backToMainMenu', backToMainMenu)
bot.callbackQuery('dailyLimit', dailyLimit)
bot.callbackQuery('diary', diary)
bot.callbackQuery('enterCaloriesNorm', enterCaloriesNorm)
bot.callbackQuery('questions', questions)
bot.callbackQuery('subscribe', subscribe)
bot.callbackQuery('userAgreement', userAgreement)
bot.callbackQuery('calculateCalories', calculateCalories)
bot.callbackQuery('caloriesRest', caloriesRest)
bot.callbackQuery('subtractCalories', subtractCalories)
bot.callbackQuery('updateDailyLimit', updateDailyLimit)
// --- ending

// Обработка любого сообщения с прикреплённым фото
bot.on(":photo", async (ctx) => photo(ctx))

// Обработка любого текстового сообщения
bot.on('message', async (ctx) => message(ctx))

// Обработка ошибок
bot.catch((error) => getErrorCatch(error))

startBot()
