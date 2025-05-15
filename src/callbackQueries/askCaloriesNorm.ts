import { ConversationCtx } from "../types"

export const askCaloriesNorm = async (ctx: ConversationCtx) => {
  await ctx.conversation.enter("askCaloriesNormConv")

  // Ускорение загрузки
  await ctx.answerCallbackQuery()
}