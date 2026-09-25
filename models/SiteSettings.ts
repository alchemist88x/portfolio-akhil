import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteSettings extends Document {
  name: string;
  fullName: string;
  title: string;
  altTitle: string;
  experienceYears: string;
  location: string;
  contactEmail: string;
  heroLabel: string;
  heroHeadline: string;
  heroDescription: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  systemStatusLabel: string;
  statusInfrastructure: string;
  statusAutomation: string;
  statusMonitoring: string;
  statusDeployment: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    name: { type: String, default: "Akhil" },
    fullName: { type: String, default: "Akhil K Anil" },
    title: { type: String, default: "DevOps Engineer & Cloud Infrastructure Engineer" },
    altTitle: { type: String, default: "System Engineer" },
    experienceYears: { type: String, default: "10+ Years" },
    location: { type: String, default: "Kochi, Kerala, India" },
    contactEmail: { type: String, default: "akhilkanil99@gmail.com" },
    heroLabel: { type: String, default: "SYSTEM / 001" },
    heroHeadline: { type: String, default: "10 years of building infrastructure that keeps applications alive." },
    heroDescription: {
      type: String,
      default:
        "DevOps and Cloud Engineer focused on cloud infrastructure, automation, Linux systems, CI/CD, security, monitoring and production environments.",
    },
    primaryCtaText: { type: String, default: "VIEW WORK →" },
    primaryCtaLink: { type: String, default: "#work" },
    secondaryCtaText: { type: String, default: "CONTACT →" },
    secondaryCtaLink: { type: String, default: "#contact" },
    systemStatusLabel: { type: String, default: "ONLINE" },
    statusInfrastructure: { type: String, default: "Operational" },
    statusAutomation: { type: String, default: "Active" },
    statusMonitoring: { type: String, default: "Active" },
    statusDeployment: { type: String, default: "Ready" },
  },
  { timestamps: true }
);

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
