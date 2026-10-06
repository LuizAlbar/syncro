import mongoose, { Schema, Document, Model, Types } from "mongoose"

export interface ITask extends Document {
  userId: Types.ObjectId
  projectId?: Types.ObjectId
  text: string
  priority: "Alta" | "Média" | "Baixa"
  done: boolean
  due: string
  goal?: string
  group: "Hoje" | "Próximos 7 Dias" | "Mais Tarde"
  kanban: "todo" | "inprogress" | "done"
  stage?: string
  createdAt: Date
  updatedAt: Date
}

const TaskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", index: true },
    text: { type: String, required: true, trim: true },
    priority: {
      type: String,
      enum: ["Alta", "Média", "Baixa"],
      default: "Média",
    },
    done: { type: Boolean, default: false },
    due: { type: String, required: true, default: "Hoje" },
    goal: { type: String, default: "" },
    group: {
      type: String,
      enum: ["Hoje", "Próximos 7 Dias", "Mais Tarde"],
      default: "Hoje",
    },
    kanban: {
      type: String,
      enum: ["todo", "inprogress", "done"],
      default: "todo",
    },
    stage: { type: String, default: "Geral" },
  },
  {
    timestamps: true,
  },
)

export const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema)
