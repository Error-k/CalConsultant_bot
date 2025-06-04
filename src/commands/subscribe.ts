import 'dotenv/config'
import { products } from "../products"
import { CommandCtx } from "../types"
import { InlineKeyboard } from 'grammy'
import { User } from '../models/User'
import { Subcription } from '../models/Subscription'
import { getDefaultError } from '../helper'

export const subscribe = (ctx: CommandCtx) => {
  // В будущем может появиться несколько видов подписок и другие цифровые продукты
  const product = products[0]

  try {
    const chatId = ctx.chat?.id
    if (!chatId) {
      throw new Error('Chat ID is not defined')
    }

    const providerInvoiceData = {
      receipt: {
        items: [
          {
            description: product.description,
            quantity: 1,
            amount: {
              value: `${product.price}.00`,
              currency: 'RUB',
            },
            vat_code: 1,
          }
        ]
      },
    }

    ctx.api.sendInvoice(
      chatId,
      product.name,
      product.description,
      product.id.toString(),
      'RUB',
      [
        {
          label: 'Руб',
          amount: product.price * 100 // Цена в копейках
        },
      ],
      {
        provider_token: process.env.PAYMENT_TOKEN,
        need_email: true,
        send_email_to_provider: true,
        provider_data: JSON.stringify(providerInvoiceData),
      }
    )
  } catch (error) {
    console.error('Error in payment')
    getDefaultError(ctx)
  }
}

export const onSuccessPayment = async (ctx: CommandCtx) => {

  if (!ctx.message?.successful_payment || !ctx.from) {
    console.error('Error in onSuccessPayment')

    return getDefaultError(ctx)
  }
  const { invoice_payload, total_amount } = ctx.message?.successful_payment

  const productId = Number(invoice_payload)
  const price = total_amount / 100

  try {
    const userId = { telegramId: ctx.from.id }
    const user = await User.findOne(userId)
    if (!user) {
      throw new Error(`User with ID ${ctx.from.id} is not found`)
    }
    await Subcription.create({
      userId: user._id,
      productId,
      price,
    })
    await User.findOneAndUpdate(userId, {
      role: 'subscriber',
    })

    const inlineKeyboard = new InlineKeyboard()
      .text('⬅️ Назад в меню', 'backToMainMenu').row()

    ctx.reply('✅Оплата прошла успешно!✅', {
      reply_markup: inlineKeyboard
    })

  } catch (error) {
    getDefaultError(ctx)
  }
}