import mongoose, { Schema, Document, Model, Types } from "mongoose"

export interface IFinanceAccount extends Document {
  userId: Types.ObjectId
  label: string
  amount: number
  change: string
  bank: string
  color: string
  createdAt: Date
  updatedAt: Date
}

const FinanceAccountSchema = new Schema<IFinanceAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    label: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, default: 0 },
    change: { type: String, default: "+$0" },
    bank: { type: String, required: true },
    color: { type: String, default: "#315d68" },
  },
  {
    timestamps: true,
  },
)

export const FinanceAccount: Model<IFinanceAccount> =
  mongoose.models.FinanceAccount ||
  mongoose.model<IFinanceAccount>("FinanceAccount", FinanceAccountSchema)
