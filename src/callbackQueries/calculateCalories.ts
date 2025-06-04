import { ConversationCtx } from "../types"

export const calculateCalories = async (ctx: ConversationCtx) => {
  await ctx.conversation.enter("calculateCaloriesConv")

  // Ускорение загрузки
  await ctx.answerCallbackQuery()
}