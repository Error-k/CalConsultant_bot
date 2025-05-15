import { Conversation } from "@grammyjs/conversations"
import { Context } from "grammy"

export const enterCaloriesNormConv = async (conversation: Conversation, ctx: Context) => {
  await ctx.reply("Если вы знаете свою ежедневную норму килокалорий, введите её цифровым значением без букв и лишних символов, например 1890. Она будет занесена в дневник, и после отправки фотографии блюда в этот чат, Вы сможете одним нажатием вычесть съеденное блюдо из своей нормы!")
  const { message } = await conversation.waitFor("message:text")
  const numberValue = Number(message.text)
  if (Boolean(numberValue) && numberValue > 0) {
    await ctx.reply(`✅Задана ежедневная норма калорий: ${message.text} ккал`)
  } else {
    await ctx.reply(`⚠️Пожалуйста, введите значение целым числом без лишних букв и символов`)
    await enterCaloriesNormConv(conversation, ctx)
  }
}
