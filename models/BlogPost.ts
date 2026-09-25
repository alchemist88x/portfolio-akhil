import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  readTime: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: { type: String, default: "DevOps", trim: true },
    tags: { type: [String], default: [] },
    coverImage: { type: String, default: "" },
    readTime: { type: String, default: "5 min read" },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes for fast lookups and listings
BlogPostSchema.index({ published: 1, sortOrder: 1, publishedAt: -1 });
BlogPostSchema.index({ slug: 1 }, { unique: true });

const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
