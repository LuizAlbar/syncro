import mongoose, { Schema, Document, Model, Types } from "mongoose"

export interface IFinanceExpenseItem
  extends Document { // formato YYYY-MM para agrupamento rápido, ex: "2026-10"
  userId: Types.ObjectId
  moduleId: Types.ObjectId
  title: string
  amount: number
  date: string
  monthYear: string
  quantity: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const FinanceExpenseItemSchema = new Schema<IFinanceExpenseItem>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: "FinanceModule",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    monthYear: { type: String, required: true, index: true },
    quantity: { type: Number, default: 1 },
    notes: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
)

export const FinanceExpenseItem: Model<IFinanceExpenseItem> =
  mongoose.models.FinanceExpenseItem ||
  mongoose.model<IFinanceExpenseItem>(
    "FinanceExpenseItem",
    FinanceExpenseItemSchema,
  )
