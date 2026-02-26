import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/model/order.model";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await context.params;
    await connectDb();
    const order = await Order.findById(orderId).populate("assignedDeliveryBoy");
    if (!order) {
      return NextResponse.json({ message: "No Order found" }, { status: 400 });
    }
    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Internal Error while getting order ${error.message}` },
      { status: 500 },
    );
  }
}
