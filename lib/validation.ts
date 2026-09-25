import { z } from "zod";

const safeUrlSchema = z
  .string()
  .trim()
  .refine(
    (url) => {
      if (!url) return true;
      const lower = url.toLowerCase();
      if (
        lower.startsWith("javascript:") ||
        lower.startsWith("data:") ||
        lower.startsWith("vbscript:") ||
        lower.includes("<") ||
        lower.includes(">")
      ) {
        return false;
      }
      return url.startsWith("https://") || url.startsWith("http://") || url.startsWith("mailto:") || url.startsWith("/");
    },
    { message: "Must be a valid, secure URL (https://, http://, mailto:, or relative path)" }
  )
  .optional()
  .or(z.literal(""));

// 1. Site Settings Schema
export const siteSettingsSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  fullName: z.string().min(1, "Full name is required").max(100),
  title: z.string().min(1, "Title is required").max(150),
  altTitle: z.string().max(150).optional().default(""),
  experienceYears: z.string().min(1, "Experience is required").max(50),
  location: z.string().min(1, "Location is required").max(100),
  contactEmail: z.string().email("Invalid email address"),
  heroLabel: z.string().min(1, "Hero label is required").max(50),
  heroHeadline: z.string().min(1, "Hero headline is required").max(300),
  heroDescription: z.string().min(1, "Hero description is required").max(1000),
  primaryCtaText: z.string().min(1, "Primary CTA text required").max(50),
  primaryCtaLink: z.string().min(1, "Primary CTA destination required").max(200),
  secondaryCtaText: z.string().min(1, "Secondary CTA text required").max(50),
  secondaryCtaLink: z.string().min(1, "Secondary CTA destination required").max(200),
  systemStatusLabel: z.string().default("ONLINE"),
  statusInfrastructure: z.string().default("Operational"),
  statusAutomation: z.string().default("Active"),
  statusMonitoring: z.string().default("Active"),
  statusDeployment: z.string().default("Ready"),
  technicalTypographyEnabled: z.boolean().default(true),
  technicalDotPatternEnabled: z.boolean().default(true),
  technicalMetadataEnabled: z.boolean().default(true),
  technicalDecorationsEnabled: z.boolean().default(true),
});

// 2. About Section Schema
export const aboutSectionSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  statementHeadline: z.string().min(1, "Statement headline required").max(300),
  statementSubheadline: z.string().min(1, "Statement subheadline required").max(300),
  paragraphs: z.array(z.string().min(1).max(2000)),
});

// 3. Experience Schema
export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required").max(150),
  role: z.string().min(1, "Role is required").max(150),
  website: safeUrlSchema,
  employmentType: z.string().max(100).optional().default("Full-time"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().default(""),
  current: z.boolean().default(false),
  description: z.string().max(3000).optional().default(""),
  responsibilities: z.array(z.string().max(1000)).default([]),
  technologies: z.array(z.string().max(100)).default([]),
  location: z.string().max(150).optional().default(""),
  sortOrder: z.number().default(0),
  published: z.boolean().default(true),
});

// 4. Skill Category Schema
export const skillCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100),
  description: z.string().max(500).optional().default(""),
  icon: z.string().max(50).optional().default(""),
  sortOrder: z.number().default(0),
  published: z.boolean().default(true),
});

// 5. Skill Schema
export const skillSchema = z.object({
  categoryId: z.string().min(1, "Category ID is required"),
  name: z.string().min(1, "Skill name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100),
  description: z.string().max(500).optional().default(""),
  icon: z.string().max(50).optional().default(""),
  level: z.enum(["", "Expert", "Advanced", "Working Knowledge", "Familiar"]).optional().default(""),
  featured: z.boolean().default(false),
  sortOrder: z.number().default(0),
  published: z.boolean().default(true),
});

// 6. Project Schema
export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(150),
  slug: z.string().min(1, "Slug is required").max(150),
  category: z.string().max(100).optional().default(""),
  description: z.string().min(1, "Description is required").max(5000),
  projectType: z.string().max(150).optional().default(""),
  environment: z.string().max(100).optional().default("Production"),
  frontend: z.string().max(100).optional().default(""),
  backend: z.string().max(100).optional().default(""),
  webServer: z.string().max(100).optional().default(""),
  architectureDiagram: z.string().max(5000).optional().default(""),
  technologies: z.array(z.string().max(100)).default([]),
  cloudPlatforms: z.array(z.string().max(100)).default([]),
  awsServices: z.array(z.string().max(100)).default([]),
  azureServices: z.array(z.string().max(100)).default([]),
  databases: z.array(z.string().max(100)).default([]),
  cicdTools: z.array(z.string().max(100)).default([]),
  responsibilities: z.array(z.string().max(1000)).default([]),
  image: safeUrlSchema,
  githubUrl: safeUrlSchema,
  liveUrl: safeUrlSchema,
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

// 7. Hobby Schema
export const hobbySchema = z.object({
  name: z.string().min(1, "Hobby name is required").max(150),
  description: z.string().max(1000).optional().default(""),
  icon: z.string().max(50).optional().default(""),
  sortOrder: z.number().default(0),
  published: z.boolean().default(true),
});

// 8. Engineering Principle Schema
export const engineeringPrincipleSchema = z.object({
  number: z.string().min(1, "Principle number is required").max(10),
  title: z.string().min(1, "Title is required").max(150),
  description: z.string().min(1, "Description is required").max(2000),
  sortOrder: z.number().default(0),
  published: z.boolean().default(true),
});

// 9. Architecture Schemas
export const architectureSchema = z.object({
  name: z.string().min(1, "Name is required").max(150),
  title: z.string().min(1, "Title is required").max(150),
  description: z.string().max(2000).optional().default(""),
  published: z.boolean().default(true),
});

export const architectureNodeSchema = z.object({
  architectureId: z.string().min(1, "Architecture ID is required"),
  name: z.string().min(1, "Node name is required").max(100),
  type: z.string().max(50).default("service"),
  description: z.string().max(1000).optional().default(""),
  icon: z.string().max(50).optional().default(""),
  x: z.number().default(0),
  y: z.number().default(0),
  sortOrder: z.number().default(0),
  published: z.boolean().default(true),
});

export const architectureConnectionSchema = z.object({
  architectureId: z.string().min(1, "Architecture ID is required"),
  sourceNodeId: z.string().min(1, "Source node is required"),
  targetNodeId: z.string().min(1, "Target node is required"),
  label: z.string().max(100).optional().default(""),
});

// 10. Pipeline Schemas
export const pipelineSchema = z.object({
  name: z.string().min(1, "Pipeline name is required").max(150),
  description: z.string().max(2000).optional().default(""),
  published: z.boolean().default(true),
});

export const pipelineStageSchema = z.object({
  pipelineId: z.string().min(1, "Pipeline ID is required"),
  name: z.string().min(1, "Stage name is required").max(100),
  description: z.string().max(1000).optional().default(""),
  icon: z.string().max(50).optional().default(""),
  sortOrder: z.number().default(0),
  published: z.boolean().default(true),
});

// 11. Terminal Command Schema
export const terminalCommandSchema = z.object({
  command: z.string().min(1, "Command is required").max(50),
  description: z.string().max(200).optional().default(""),
  output: z.string().max(10000).optional().default(""),
  sortOrder: z.number().default(0),
  published: z.boolean().default(true),
});

// 12. Social Link Schema
export const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required").max(50),
  label: z.string().min(1, "Label is required").max(100),
  url: safeUrlSchema,
  icon: z.string().max(50).optional().default(""),
  sortOrder: z.number().default(0),
  published: z.boolean().default(true),
});

// 13. Navigation Item Schema
export const navigationItemSchema = z.object({
  label: z.string().min(1, "Label is required").max(50),
  sectionId: z.string().min(1, "Section ID is required").max(50),
  sortOrder: z.number().default(0),
  published: z.boolean().default(true),
});

// 14. SEO Settings Schema
export const seoSettingsSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  description: z.string().min(1, "Description is required").max(500),
  keywords: z.array(z.string().max(50)).default([]),
  ogTitle: z.string().max(150).optional().default(""),
  ogDescription: z.string().max(500).optional().default(""),
  ogImage: safeUrlSchema,
  canonicalUrl: safeUrlSchema,
});

// 15. Contact Message Schema
export const contactMessageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be at most 100 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message cannot be empty").max(5000, "Message must be at most 5000 characters"),
});

// 16. Admin Login Schema
export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// 17. Admin Account Update Schema
export const adminAccountSchema = z.object({
  email: z.string().email("Invalid email address"),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, "New password must be at least 8 characters").optional(),
});
