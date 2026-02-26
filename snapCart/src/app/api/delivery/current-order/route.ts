import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import DeliveryAssignment from "@/model/deliveryAssignment.model";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    await connectDb();

    // will populate only order.address
    const activeAssignments = await DeliveryAssignment.findOne({
      assignedTo: session?.user?.id,
      status: "assigned",
    }).populate({
      path: "order",
      populate: { path: "address" },
    });

    // .populate("order").lean();  it is also ok
    // if we needed further nesting from order to user next
    // .populate({
    //    path: "order",
    //    populate: { path: "user" },
    //  })
    //  .lean();

    if (!activeAssignments) {
      return NextResponse.json(
        { active: false, message: "There is no assigned order" },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { active: true, assignment: activeAssignments },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `error while checking assigned orders ${error}` },
      { status: 501 },
    );
  }
}
