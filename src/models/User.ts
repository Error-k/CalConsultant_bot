import { Document, model, Schema } from 'mongoose'

interface IUser extends Document {
  telegramId: number
  firstName: string
  username: string
  createdAt: Date
}

const userSchema = new Schema<IUser>({
  telegramId: {
    type: Number,
    required: [true, 'Telegram ID is required'],
    unique: true,
  },
  firstName: {
    type: String,
  },
  username: {
    type: String,
  },
}, {
  timestamps: true,
})

export const User = model<IUser>('User', userSchema)