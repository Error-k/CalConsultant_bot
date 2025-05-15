import { ConversationCtx } from "../types"

export const enterCaloriesNorm = async (ctx: ConversationCtx) => {
  await ctx.conversation.enter("enterCaloriesNormConv")

  // Ускорение загрузки
  await ctx.answerCallbackQuery()
}