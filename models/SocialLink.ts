import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISocialLink extends Document {
  platform: string;
  label: string;
  url: string;
  icon?: string;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinkSchema = new Schema<ISocialLink>(
  {
    platform: { type: String, required: true },
    label: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SocialLinkSchema.index({ published: 1, sortOrder: 1 });

const SocialLink: Model<ISocialLink> =
  mongoose.models.SocialLink || mongoose.model<ISocialLink>("SocialLink", SocialLinkSchema);

export default SocialLink;
