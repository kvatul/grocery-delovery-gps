import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import DeliveryAssignment from "@/model/deliveryAssignment.model";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    await connectDb();

    const assignments = await DeliveryAssignment.find({
      broadcastedTo: session?.user?.id,
      status: "broadcasted",
    }).populate("order");

    if (!assignments) {
      return NextResponse.json(
        { message: "There is no delivery broadcasted" },
        { status: 200 },
      );
    }

    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `error while checking assignment ${error}` },
      { status: 501 },
    );
  }
}
