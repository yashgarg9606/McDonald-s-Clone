import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStore extends Document {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    landmark?: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  phone: string;
  email?: string;
  timing: {
    open: string; // HH:mm format
    close: string; // HH:mm format
  };
  daysOpen: string[]; // ['Monday', 'Tuesday', ...]
  isOpen: boolean;
  services: {
    dineIn: boolean;
    takeaway: boolean;
    delivery: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const StoreSchema = new Schema<IStore>(
  {
    name: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      landmark: { type: String },
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    phone: { type: String, required: true },
    email: { type: String },
    timing: {
      open: { type: String, required: true },
      close: { type: String, required: true },
    },
    daysOpen: [{ type: String }],
    isOpen: { type: Boolean, default: true },
    services: {
      dineIn: { type: Boolean, default: true },
      takeaway: { type: Boolean, default: true },
      delivery: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

const Store: Model<IStore> = mongoose.models.Store || mongoose.model<IStore>('Store', StoreSchema);

export default Store;

