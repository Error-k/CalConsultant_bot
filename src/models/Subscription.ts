import { Document, model, Schema, Types } from 'mongoose'

interface ISubcription extends Document {
  userId: Types.ObjectId
  productId: number
  price: number
  createdAt: Date
}

const subcriptionSchema = new Schema<ISubcription>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  productId: {
    type: Number,
    required: [true, 'Product ID is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  }
}, {
  timestamps: true,
})

export const Subcription = model<ISubcription>('Subcription', subcriptionSchema)