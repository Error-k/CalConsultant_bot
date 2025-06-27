import { Document, model, Schema } from 'mongoose'

export enum UserRoles {
  admin = 'admin',
  user = 'user',
  subscriber = 'subscriber',
}

interface IUser extends Document {
  telegramId: number
  firstName: string
  username: string
  dailyLimit: number
  todayRestLimit: number
  role: UserRoles
  freePhotoAttempts: number
  freeTextAttempts: number
  createdAt: Date
}

const userSchema = new Schema<IUser>({
  telegramId: {
    type: Number,
    required: [true, 'Telegram ID is required'],
    unique: true,
  },
  firstName: { type: String },
  username: { type: String },
  dailyLimit: { type: Number },
  todayRestLimit: { type: Number },
  role: { type: String },
  freePhotoAttempts: { type: Number },
  freeTextAttempts: { type: Number },
}, {
  timestamps: true,
})

export const User = model<IUser>('User', userSchema)