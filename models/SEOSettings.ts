import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISEOSettings extends Document {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SEOSettingsSchema = new Schema<ISEOSettings>(
  {
    title: { type: String, default: "Akhil — DevOps Engineer & Cloud Infrastructure Engineer" },
    description: {
      type: String,
      default:
        "DevOps and Cloud Infrastructure Engineer with 10+ years of experience in cloud platforms, Linux, automation, CI/CD, infrastructure and production systems.",
    },
    keywords: {
      type: [String],
      default: [
        "DevOps",
        "Cloud Infrastructure",
        "AWS",
        "Azure",
        "Terraform",
        "Kubernetes",
        "Docker",
        "CI/CD",
        "Linux",
        "Production Systems",
      ],
    },
    ogTitle: { type: String, default: "Akhil — DevOps Engineer & Cloud Infrastructure Engineer" },
    ogDescription: {
      type: String,
      default: "10+ Years of experience building, automating, and operating resilient cloud infrastructure.",
    },
    ogImage: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const SEOSettings: Model<ISEOSettings> =
  mongoose.models.SEOSettings || mongoose.model<ISEOSettings>("SEOSettings", SEOSettingsSchema);

export default SEOSettings;
