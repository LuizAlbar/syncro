import mongoose, { Schema, Document, Model } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  passwordHash: string
  avatar?: string
  plan: "Free" | "Pro" | "Enterprise"
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: "" },
    plan: { type: String, enum: ["Free", "Pro", "Enterprise"], default: "Pro" },
  },
  {
    timestamps: true,
  },
)

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
