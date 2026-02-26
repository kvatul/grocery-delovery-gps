import connectDb from "@/lib/db";
import Order from "@/model/order.model";
import Message from "@/model/message.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { orderId, senderId, text, time } = await req.json();
    const order = await Order.findById(orderId);
    if (!order)
      return NextResponse.json({ message: "No Order found" }, { status: 400 });

    const message = Message.create({ orderId, senderId, text, time });
    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `error while saving chat messages ${error}` },
      { status: 501 },
    );
  }
}
