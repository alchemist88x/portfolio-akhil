import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITerminalCommand extends Document {
  command: string;
  description?: string;
  output: string;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TerminalCommandSchema = new Schema<ITerminalCommand>(
  {
    command: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    output: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

TerminalCommandSchema.index({ published: 1, sortOrder: 1 });

const TerminalCommand: Model<ITerminalCommand> =
  mongoose.models.TerminalCommand ||
  mongoose.model<ITerminalCommand>("TerminalCommand", TerminalCommandSchema);

export default TerminalCommand;
