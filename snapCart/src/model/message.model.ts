import { Schema, model, models } from "mongoose";

export interface IMessage {
  orderId?: Schema.Types.ObjectId;
  senderId?: Schema.Types.ObjectId;
  text: string;
  time: string;
}

const messageSchema = new Schema<IMessage>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
      required: true,
    },

    time: {
      type: String,
    },
  },
  { timestamps: true },
);

const Message = models?.Message || model<IMessage>("Message", messageSchema);
export default Message;
