import connectDb from "@/lib/db";
import { sendmail } from "@/lib/mailer";
import Order from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    console.log(orderId);
    await connectDb();
    const order = await Order.findById(orderId).populate("user");
    if (!order)
      return NextResponse.json({ message: "Order Not found" }, { status: 400 });
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    order.deliveryOtp = otp;
    await order.save();
    await sendmail(
      order.user.email,
      "Your Delivery Otp",
      `<h2>Your delivery otp is <strong>${otp}</strong></h2>`,
    );
    return NextResponse.json(
      { message: "Otp send successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Server error while sending otp ${error}` },
      { status: 501 },
    );
  }
}
