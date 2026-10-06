import mongoose, { Schema, Document, Model, Types } from "mongoose"

export interface IFinanceModule extends Document {
  userId: Types.ObjectId
  name: string
  category: string
  icon: string
  color: string
  budget?: number
  description?: string
  createdAt: Date
  updatedAt: Date
}

const FinanceModuleSchema = new Schema<IFinanceModule>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    category: { type: String, default: "Geral" },
    icon: { type: String, default: "Wallet" },
    color: { type: String, default: "#315d68" },
    budget: { type: Number, default: 0 },
    description: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
)

export const FinanceModule: Model<IFinanceModule> =
  mongoose.models.FinanceModule ||
  mongoose.model<IFinanceModule>("FinanceModule", FinanceModuleSchema)
