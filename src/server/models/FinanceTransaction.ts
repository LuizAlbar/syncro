import mongoose, { Schema, Document, Model, Types } from "mongoose"

export interface IFinanceTransaction extends Document {
  userId: Types.ObjectId
  date: string
  desc: string
  cat: string
  account: string
  amt: number
  status: "Pago" | "Pendente"
  createdAt: Date
  updatedAt: Date
}

const FinanceTransactionSchema = new Schema<IFinanceTransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: { type: String, required: true },
    desc: { type: String, required: true, trim: true },
    cat: { type: String, required: true },
    account: { type: String, required: true, default: "Corrente" },
    amt: { type: Number, required: true },
    status: { type: String, enum: ["Pago", "Pendente"], default: "Pago" },
  },
  {
    timestamps: true,
  },
)

export const FinanceTransaction: Model<IFinanceTransaction> =
  mongoose.models.FinanceTransaction ||
  mongoose.model<IFinanceTransaction>(
    "FinanceTransaction",
    FinanceTransactionSchema,
  )
