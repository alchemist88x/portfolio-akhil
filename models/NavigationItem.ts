import mongoose, { Schema, Document, Model } from "mongoose";

export interface INavigationItem extends Document {
  label: string;
  sectionId: string;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NavigationItemSchema = new Schema<INavigationItem>(
  {
    label: { type: String, required: true },
    sectionId: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

NavigationItemSchema.index({ published: 1, sortOrder: 1 });

const NavigationItem: Model<INavigationItem> =
  mongoose.models.NavigationItem ||
  mongoose.model<INavigationItem>("NavigationItem", NavigationItemSchema);

export default NavigationItem;
