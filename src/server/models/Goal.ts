import mongoose, { Schema, Document, Model, Types } from "mongoose"

export interface IMilestone {
  label: string
  done: boolean
}

export interface IGoal extends Document {
  userId: Types.ObjectId
  title: string
  cat: string
  catColor: string
  deadline: string
  current: number
  target: number
  unit: string
  pct: number
  status: "financial" | "milestone" | "completed" | "inprogress"
  milestones: IMilestone[]
  createdAt: Date
  updatedAt: Date
}

const MilestoneSchema = new Schema<IMilestone>(
  {
    label: { type: String, required: true },
    done: { type: Boolean, default: false },
  },
  { _id: false },
)

const GoalSchema = new Schema<IGoal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    cat: { type: String, required: true, default: "Financeira" },
    catColor: { type: String, default: "#315d68" },
    deadline: { type: String, required: true },
    current: { type: Number, default: 0 },
    target: { type: Number, required: true },
    unit: { type: String, default: "$" },
    pct: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["financial", "milestone", "completed", "inprogress"],
      default: "inprogress",
    },
    milestones: { type: [MilestoneSchema], default: [] },
  },
  {
    timestamps: true,
  },
)

export const Goal: Model<IGoal> =
  mongoose.models.Goal || mongoose.model<IGoal>("Goal", GoalSchema)
