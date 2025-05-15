import { Conversation } from "@grammyjs/conversations"
import { Context } from "grammy"
import { GENDERS } from "../consts"

export const askCaloriesNormConv = async (conversation: Conversation, ctx: Context) => {
  await ctx.reply("Мы поможем Вам рассчитать суточную норму потребления калорий по формуле Миффлина-Сан Жеора! Для этого необходимо указать пол, вес, рост и возраст")

  let userGender = ""
  let userMass = 0
  let userHeight = 0
  let userAge = 0

  const getGender = async () => {
    await ctx.reply('✍️Пожалуйста, напишите Ваш ПОЛ одной буквой "Ж" или "М"')
    const gender = await conversation.waitFor("message:text")
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
      return (10 * userMass) + (6.25 * userHeight) - (5 * userAge) + 5
    } else {
      return (10 * userMass) + (6.25 * userHeight) - (5 * userAge) - 161
    }
  }

  await getGender()
  await getMass()
  await getHeight()
  await getAge()
  const dailyLimit = await getDailyLimit()

  await ctx.reply(`Пол ${userGender}, Вес: ${userMass}, Возраст: ${userAge}, Норма калорий: ${dailyLimit}`)
}
