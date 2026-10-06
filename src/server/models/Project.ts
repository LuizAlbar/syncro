import mongoose, { Schema, Document, Model, Types } from "mongoose"

export interface IProject extends Document {
  userId: Types.ObjectId
  title: string
  description: string
  category: string
  status: "Planejamento" | "Em Andamento" | "Pausado" | "Concluído"
  progress: number
  deadline: string
  color: string
  budget?: number
  tasksCount: number
  completedTasksCount: number
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, default: "Geral" },
    status: {
      type: String,
      enum: ["Planejamento", "Em Andamento", "Pausado", "Concluído"],
      default: "Em Andamento",
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    deadline: { type: String, required: true },
    color: { type: String, default: "#315d68" },
    budget: { type: Number, default: 0 },
    tasksCount: { type: Number, default: 0 },
    completedTasksCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
)

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema)
