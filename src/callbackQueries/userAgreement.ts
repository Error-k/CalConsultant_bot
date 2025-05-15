import { InputFile } from 'grammy'
import { CommandCtx } from '../types'
import { getMainMenuReply } from '../helper'

export const userAgreement = async (ctx: CommandCtx) => {
  await ctx.callbackQuery?.message?.editText('Пользовательское соглашение:')
  await ctx.replyWithDocument(new InputFile('./assets/userAgreement.pdf'))
  await getMainMenuReply(ctx)
  await ctx.answerCallbackQuery()
}