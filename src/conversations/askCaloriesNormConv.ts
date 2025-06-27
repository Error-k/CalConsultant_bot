import { Conversation } from "@grammyjs/conversations"
import { COMMAND_NAMES_WITH_SLASH, GENDERS } from "../consts"
import { getDefaultError, getMainMenuReply } from "../helper"
import { CommandCtx } from "../types"
import { User } from "../models/User"

export const askCaloriesNormConv = async (conversation: Conversation, ctx: CommandCtx) => {
  await ctx.reply("Мы поможем Вам рассчитать суточную норму потребления калорий по формуле Миффлина-Сан Жеора! Для этого необходимо указать пол, вес, рост и возраст")

  let userGender = ""
  let userMass = 0
  let userHeight = 0
  let userAge = 0

  const getGender = async () => {
    await ctx.reply('✍️Пожалуйста, напишите Ваш ПОЛ одной буквой "Ж" или "М"')
    const gender = await conversation.waitFor("message:text")

    // Выход из диалога, если пользователь отправляет любую комманду
    if (COMMAND_NAMES_WITH_SLASH.includes(gender.message.text)) {
      getMainMenuReply(ctx)
      await conversation.halt()
    }

    if (gender.message.text.length === 1 && GENDERS.includes(gender.message.text.toUpperCase())) {
      userGender = gender.message.text.toUpperCase()
    } else {
      await ctx.reply(`⚠️Пожалуйста, напишите Ваш пол одной буквой "Ж" или "М" без лишних букв, символов и цифр`)
      await getGender()
    }
  }
  const getMass = async () => {
    await ctx.reply('✍️Пожалуйста, напишите Ваш ВЕС в килограммах')
    const mass = await conversation.waitFor("message:text")

    // Выход из диалога, если пользователь отправляет любую комманду
    if (COMMAND_NAMES_WITH_SLASH.includes(mass.message.text)) {
      getMainMenuReply(ctx)
      await conversation.halt()
    }

    const numberMass = Number(mass.message.text)
    if (Boolean(numberMass) && numberMass > 0) {
      userMass = numberMass
    } else {
      await ctx.reply(`⚠️Пожалуйста, напишите Ваш вес в килограммах целым числом без лишних букв, символов и цифр, например 75`)
      await getMass()
    }
  }
  const getHeight = async () => {
    await ctx.reply('✍️Пожалуйста, напишите Ваш РОСТ в сантиметрах')
    const height = await conversation.waitFor("message:text")

    // Выход из диалога, если пользователь отправляет любую комманду
    if (COMMAND_NAMES_WITH_SLASH.includes(height.message.text)) {
      getMainMenuReply(ctx)
      await conversation.halt()
    }

    const numberHeight = Number(height.message.text)
    if (Boolean(numberHeight) && numberHeight > 0) {
      userHeight = numberHeight
    } else {
      await ctx.reply(`⚠️Пожалуйста, напишите Ваш рост в сантиметрах целым числом без лишних букв, символов и цифр, например 172`)
      await getHeight()
    }
  }
  const getAge = async () => {
    await ctx.reply('✍️Пожалуйста, напишите Ваш ВОЗРАСТ в полных годах')
    const age = await conversation.waitFor("message:text")

    // Выход из диалога, если пользователь отправляет любую комманду
    if (COMMAND_NAMES_WITH_SLASH.includes(age.message.text)) {
      getMainMenuReply(ctx)
      await conversation.halt()
    }

    const numberAge = Number(age.message.text)
    if (Boolean(numberAge) && numberAge > 0) {
      userAge = numberAge
    } else {
      await ctx.reply(`⚠️Пожалуйста, напишите Ваш возраст в полных годах целым числом без лишних букв, символов и цифр, например 36`)
      await getAge()
    }
  }
  const getDailyLimit = async () => {
    if (userGender === "М") {
      return Math.floor((10 * userMass) + (6.25 * userHeight) - (5 * userAge) + 5)
    } else {
      return Math.floor((10 * userMass) + (6.25 * userHeight) - (5 * userAge) - 161)
    }
  }

  await getGender()
  await getMass()
  await getHeight()
  await getAge()
  const dailyLimit = await getDailyLimit()

  if (Boolean(dailyLimit) && dailyLimit > 0) {
    if (!ctx.from) {
      console.error('Ошибка при получении данных о пользователе')
      return getDefaultError(ctx)
    }
    const userId = { telegramId: ctx.from.id}
    await User.findOneAndUpdate(userId, {
      dailyLimit: dailyLimit,
      todayRestLimit: dailyLimit,
    })
    await ctx.reply(`✅Задана ежедневная норма калорий: ${dailyLimit} ккал`)
    await getMainMenuReply(ctx)
  }
}
