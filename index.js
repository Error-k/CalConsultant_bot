require('dotenv').config()
const { Bot, GrammyError, HttpError, InlineKeyboard } = require('grammy')
const { hydrate } = require('@grammyjs/hydrate')

const OpenAI = require("openai")

const bot = new Bot(process.env.BOT_API_KEY)
bot.use(hydrate())

const client = new OpenAI()


// Меню команд
bot.api.setMyCommands([
  {
    command: 'start',
    description: 'Запуск бота',
  },
  {
    command: 'menu',
    description: 'Главное меню',
  }
])

const MAIN_MENU = new InlineKeyboard()
  .text('1', 'button-1')
  .text('2', 'button-2').row()
  .text('Остались вопросы?', 'questions')

// Обработка команд
bot.command('start', async (ctx) => {
  await ctx.reply('Здесь должна быть инструкция......', {
    reply_markup: MAIN_MENU
  })
})

// Клавиатура в сообщениях бота
bot.command('menu', async (ctx) => {
  await ctx.reply('Основное меню', {
    reply_markup: MAIN_MENU
  })
})


// Обработка нажатий по кнопкам инлайн меню
// --- start
bot.callbackQuery('questions', async (ctx) => {
  const inlineKeyboard = new InlineKeyboard()
    .text('⬅️ Назад в меню', 'backToMainMenu').row()
    .url('Чат с поддержкой', 'https://t.me/+ErSwjn3n6Bs5Y2Fi').row()
    .text('Пользовательское соглашение', 'userSolution')

  // editText - метод из hydrate для интерактивного меню без захлмаления переписки
  await ctx.callbackQuery.message.editText('Техническая поддержка', {
    reply_markup: inlineKeyboard
  })
  // Ускорение загрузки
  await ctx.answerCallbackQuery()
})

bot.callbackQuery('backToMainMenu', async (ctx) => {
  await ctx.callbackQuery.message.editText('Основное меню', {
    reply_markup: MAIN_MENU
  })
  await ctx.answerCallbackQuery()
})
// --- end

// bot.on('callback_query:data', async (ctx) => {
//   const { data } = ctx.callbackQuery
//   // Ускорение загрузки
//   await ctx.answerCallbackQuery()

//   if (data === 'questions') {
//     const inlineKeyboard = new InlineKeyboard()
//     .text('⬅️ Назад в меню', 'backToMainMenu').row()
//     .url('Чат с поддержкой', 'https://t.me/+ErSwjn3n6Bs5Y2Fi').row()
//     .text('Пользовательское соглашение', 'userSolution')
  
//     await ctx.reply('Техническая поддержка', {
//       reply_markup: inlineKeyboard
//     })
//   }
//   else if (data === 'backToMainMenu') {
//     await ctx.reply('Основное меню', {
//       reply_markup: MAIN_MENU
//     })
//   }
//   else {
//     await ctx.reply(`Вы выбрали кнопку ${data}`)
//   }
// })

bot.on(":photo", async (ctx) => {
  // const photo = ctx.message.photo
  const photo = await ctx.getFile()
  const path = photo.file_path;
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "user",
        content:
        "Проанализируй картинку. Если это не еда, не блюдо или не продукт, то напиши в ответе 'Пожалуйста, пришлите фотографию блюда'." +
        "Если это еда, блюдо или продукт, то напиши название этого блюда или продукта. Напиши его БЖУ, калорийность как на 100г, так и на целую стандартную порцию" +
        "и способы сжечь набранные калории после употребления этого блюда или продукта. Оформи со смайликами и без звёздочек. ",
      },
      {
        role: "user",
        content: [
          {
            type: "input_image", 
            image_url: `https://api.telegram.org/file/bot${process.env.BOT_API_KEY}/${path}`,
          }
        ],
      },
    ],
  })
  
  await ctx.reply(response.output_text)

  // await ctx.reply(`photo: ${photo}, path: ${path}` )
})

// 
bot.on('message', async (ctx) => {
  const text = ctx.message.text
  const response = await client.responses.create({
    model: "gpt-4.1",
    input: [
      { role: "user", content: text },
    ],
  })

  await ctx.reply(response.output_text)
})

// Обработка ошибок
bot.catch((error) => {
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
})

bot.start()
