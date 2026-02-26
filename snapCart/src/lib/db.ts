import { connect } from "mongoose";

let mongodburl: string = process.env.MONGODB_URL as string;
console.log("mongodb", mongodburl);
if (!mongodburl) throw new Error("mongodburl not defined");
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDb() {
  if (cached.conn) {
    //console.log("db cached conn");
    return cached.conn;
  }
  if (!cached.promise) {
    cached.conn = connect(mongodburl); //.then((c) => c.connection);
  }
  try {
    if (cached.promise) cached.conn = await cached.promise;
    {
      //console.log("db cached promise");
    }
  } catch (error) {
    throw new Error("Error in connection mongodb");
  }
  return cached.conn;
}

export default connectDb;
