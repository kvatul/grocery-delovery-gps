import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/model/order.model";
import User from "@/model/user.model";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function POST(req: NextRequest) {
  try {
    const { userId, items, paymentMethod, totalAmount, address } =
      await req.json();
    if (!userId || !items || !paymentMethod || !totalAmount || !address)
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    await connectDb();
    let user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ message: "User Not found" }, { status: 400 });

    const order = await Order.create({
      user: userId,
      items,
      paymentMethod,
      totalAmount,
      address,
    });

    const session = stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_BASE_URL}/user/ordersuccess`,
      cancel_url: `${process.env.NEXT_BASE_URL}/user/ordercancel`,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "snapCart",
            },
            unit_amount: totalAmount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: { orderId: order._id.toString() },
    });

    return NextResponse.json({ url: (await session).url }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Internal Error while online payment, ${error.message}` },
      { status: 500 },
    );
  }
}
