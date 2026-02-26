import { Schema, model, models } from "mongoose";

export interface IDeliveryAssignment {
  _id?: Schema.Types.ObjectId;
  order: Schema.Types.ObjectId;
  broadcastedTo: Schema.Types.ObjectId[];
  assignedTo: Schema.Types.ObjectId;
  status: "broadcasted" | "assigned" | "completed";
  acceptedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const deliveryAssignmentSchema = new Schema<IDeliveryAssignment>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    broadcastedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["broadcasted", "assigned", "completed"],
      default: "broadcasted",
    },
    acceptedAt: Date,
  },
  { timestamps: true },
);

const DeliveryAssignment =
  models?.DeliveryAssignment ||
  model<IDeliveryAssignment>("DeliveryAssignment", deliveryAssignmentSchema);
export default DeliveryAssignment;
