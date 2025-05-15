import { BotError, GrammyError, HttpError } from 'grammy'
import { MAIN_MENU } from './consts'
import { CommandCtx } from './types'
import mongoose from 'mongoose'
import { bot } from '.'

export const getMainMenuReply = (ctx: CommandCtx) => {
  return ctx.reply('Основное меню📋', {
    reply_markup: MAIN_MENU
  })
}

export const getErrorCatch = (error: BotError<CommandCtx>) => {
  const ctx = error.ctx
  console.error(`Ошибка обновления: ${ctx.update.update_id}`)
  const er = error.error

  if (er instanceof GrammyError) {
    console.error('Ошибка в запросе:', er.description)
  } else if (er instanceof HttpError) {
    console.error('Ошибка запроса', er)
  } else {
    console.error('Неизвестная ошибка', er)
  }
}

export async function startBot() {
  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined')
  }

  try {
    await mongoose.connect(MONGODB_URI)
    bot.start()
    console.log('MongoDB connected, Bot started')
  } catch (error) {
    console.error('Error in startBot: ', error)
  }
}