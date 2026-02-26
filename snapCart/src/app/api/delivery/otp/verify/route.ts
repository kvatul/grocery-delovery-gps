import connectDb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/model/deliveryAssignment.model";
import Order from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { orderId, otp } = await req.json();
    if (!orderId || !otp) {
      return NextResponse.json(
        { message: "Order or otp not found " },
        { status: 400 },
      );
    }

    await connectDb();
    const order = await Order.findById(orderId);
    if (!order)
      return NextResponse.json({ message: "Order Not found" }, { status: 400 });

    if (order.deliveryOtp != otp)
      return NextResponse.json(
        { message: "Otp does not match " },
        { status: 400 },
      );
    // updating order
    order.status = "delivered";
    order.otpVerification = true;
    order.deliveredAt = new Date();
    await order.save();
    await emitEventHandler("update-order-status", {
      orderId: order._id,
      status: order.status,
    });

    // updating delivery assignment
    await DeliveryAssignment.updateOne(
      {
        order: orderId,
      },
      {
        $set: { assignedTo: null, status: "completed" },
      },
    );

    return NextResponse.json(
      { message: "delivery send successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Server error while verifying otp ${error}` },
      { status: 501 },
    );
  }
}
