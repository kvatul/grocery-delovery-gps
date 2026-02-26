import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/model/order.model";
import User from "@/model/user.model";
import { auth } from "@/auth";
import emitEventHandler from "@/lib/emitEventHandler";

export async function POST(req: NextRequest) {
  try {
    //console.log(await req.json());

    const { userId, items, paymentMethod, totalAmount, address } =
      await req.json();
    if (!userId || !items || !paymentMethod || !totalAmount || !address)
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );

    //console.log(items);
    //return NextResponse.json(
    //  { userId, items, paymentMethod, totalAmount, address },
    //  { status: 400 },
    //);

    await connectDb();
    let user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ message: "User Not found" }, { status: 400 });

    //   return NextResponse.json(
    //     { user, userId, items, paymentMethod, totalAmount, address },
    //     { status: 405 },
    //   );

    const order = await Order.create({
      user: userId,
      items,
      paymentMethod,
      totalAmount,
      address,
    });

    await emitEventHandler("new-order", order);

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Internal Error, ${error.message}` },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    const user = await User.findById(session?.user?.id);
    if (!user)
      return NextResponse.json({ message: "User Not found" }, { status: 400 });
    const orders = await Order.find({ user: user?._id })
      .populate("user assignedDeliveryBoy")
      .sort({ createdAt: -1 });
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
