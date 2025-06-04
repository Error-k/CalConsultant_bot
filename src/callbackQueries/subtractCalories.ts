import { ConversationCtx } from "../types"

export const subtractCalories = async (ctx: ConversationCtx) => {
  await ctx.conversation.enter("subtractCaloriesConv")

  // Ускорение загрузки
  await ctx.answerCallbackQuery()
}