import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAboutSection extends Document {
  title: string;
  statementHeadline: string;
  statementSubheadline: string;
  paragraphs: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AboutSectionSchema = new Schema<IAboutSection>(
  {
    title: { type: String, default: "Behind the infrastructure" },
    statementHeadline: { type: String, default: "Infrastructure is invisible when it works." },
    statementSubheadline: { type: String, default: "My job is to make sure it keeps working." },
    paragraphs: {
      type: [String],
      default: [
        "I'm Akhil, a DevOps and Cloud Infrastructure Engineer with 10+ years of experience working with servers, cloud platforms, automation and production systems.",
        "I enjoy turning complicated infrastructure into systems that are predictable, automated and easier to operate.",
        "My work sits between application development and infrastructure — making sure software doesn't just work during development, but continues working reliably in production.",
      ],
    },
  },
  { timestamps: true }
);

const AboutSection: Model<IAboutSection> =
  mongoose.models.AboutSection || mongoose.model<IAboutSection>("AboutSection", AboutSectionSchema);

export default AboutSection;
