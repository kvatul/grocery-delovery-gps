import { Schema, model, models } from "mongoose";

export interface Iuser {
  _id?: Schema.Types.ObjectId;
  name?: string;
  email: string;
  password?: string;
  mobile?: string;
  image?: string;
  role?: "user" | "admin" | "deliveryman";
  location: {
    type: {
      type: StringConstructor;
      enum: string[];
      default: string;
    };
    coordinates: [number, number];
  };
  socketId: string | null;
  isOnline: boolean;
}

const UserSchema = new Schema<Iuser>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    mobile: {
      type: String,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "deliveryman"],
      default: "user",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number, Number],
        default: [0, 0],
      },
    },
    socketId: {
      type: String,
      default: null,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
UserSchema.index({ location: "2dsphere" });

//const User = mongoose.models?.User || mongoose.model("User", userSchema);
//export default User;

export default models?.User || model<Iuser>("User", UserSchema);
