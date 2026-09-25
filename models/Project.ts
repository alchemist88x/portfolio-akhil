import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  name: string;
  slug: string;
  category?: string;
  description: string;
  projectType?: string;
  technologies: string[];
  cloudPlatforms: string[];
  awsServices: string[];
  azureServices: string[];
  databases: string[];
  cicdTools: string[];
  responsibilities: string[];
  image?: string;
  environment?: string;
  frontend?: string;
  backend?: string;
  webServer?: string;
  architectureDiagram?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, default: "" },
    description: { type: String, required: true },
    projectType: { type: String, default: "" },
    environment: { type: String, default: "Production" },
    frontend: { type: String, default: "" },
    backend: { type: String, default: "" },
    webServer: { type: String, default: "" },
    architectureDiagram: { type: String, default: "" },
    technologies: { type: [String], default: [] },
    cloudPlatforms: { type: [String], default: [] },
    awsServices: { type: [String], default: [] },
    azureServices: { type: [String], default: [] },
    databases: { type: [String], default: [] },
    cicdTools: { type: [String], default: [] },
    responsibilities: { type: [String], default: [] },
    image: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProjectSchema.index({ published: 1, featured: 1, sortOrder: 1 });
ProjectSchema.index({ slug: 1 }, { unique: true });

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
