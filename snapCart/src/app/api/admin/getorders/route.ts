import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/model/order.model";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const orders = await Order.find({})
      .populate("user assignedDeliveryBoy")
      .populate("assignedDeliveryBoy", "name mobile")
      .sort({
        createdAt: -1,
      });
    if (!orders)
      return NextResponse.json({ message: "No Order found" }, { status: 400 });
    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    NextResponse.json(
      { message: `Internal Error ${error.message}` },
      { status: 400 },
    );
  }
}
