import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: 'burgers' | 'fries' | 'beverages' | 'desserts';
  price: number;
  image: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
  customizable: boolean;
  ingredients?: string[];
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['burgers', 'fries', 'beverages', 'desserts'],
      required: true,
    },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    nutrition: {
      calories: { type: Number, required: true },
      protein: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fat: { type: Number, required: true },
      fiber: { type: Number },
    },
    customizable: { type: Boolean, default: false },
    ingredients: [{ type: String }],
    available: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;

