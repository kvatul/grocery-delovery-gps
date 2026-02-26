import { Schema, model, models } from "mongoose";

export interface IOrder {
  _id?: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  items: [
    {
      grocery: Schema.Types.ObjectId;
      name: string;
      quantity: number;
      price: string;
      unit: string;
      image: string;
    },
  ];
  totalAmount: number;
  paymentMethod: "cod" | "online";
  status: "pending" | "out for delivery" | "delivered";
  address: {
    name: string;
    mobile: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  isPaid: boolean;
  assignedDeliveryBoy?: Schema.Types.ObjectId | null;
  assignment?: Schema.Types.ObjectId;
  deliveryOtp: string | null;
  otpVerification: boolean;
  deliveredAt: Date;
  createdAt?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        grocery: {
          type: Schema.Types.ObjectId,
          ref: "Grocery",
          required: true,
        },
        name: String,
        quantity: Number,
        price: String,
        unit: String,
        image: String,
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "out for delivery", "delivered"],
      default: "pending",
    },

    address: {
      name: String,
      mobile: String,
      city: String,
      state: String,
      pincode: String,
      fullAddress: String,
      latitude: Number,
      longitude: Number,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    assignedDeliveryBoy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    assignment: {
      type: Schema.Types.ObjectId,
      ref: "DeliveryAssignment",
      default: null,
    },

    deliveryOtp: {
      type: String,
      default: null,
    },
    otpVerification: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  { timestamps: true },
);
const Order = models?.Order || model<IOrder>("Order", orderSchema);
export default Order;
