import { auth } from "@/auth";
import connectDb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/model/deliveryAssignment.model";
import Order from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const session = await auth();
    const deliveryBoyId = session?.user?.id;
    if (!deliveryBoyId)
      return NextResponse.json(
        { message: "unauthorized User" },
        { status: 400 },
      );
    await connectDb();
    const assignment = await DeliveryAssignment.findById(id);
    if (!assignment)
      return NextResponse.json(
        { message: "No Assignment found" },
        { status: 400 },
      );

    // checking wether this assignment is assigned before assigned it to other user
    if (assignment.status !== "broadcasted")
      return NextResponse.json(
        { message: "Order is already assigned to other delivery boy " },
        { status: 400 },
      );

    // checking that boy have already assignment to finish
    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: { $nin: ["broadcasted", "completed"] }, // or status:"assigned"
    });
    if (alreadyAssigned)
      return NextResponse.json(
        { message: "You have already one assignment to complete" },
        { status: 400 },
      );

    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    assignment.assignedTo = deliveryBoyId;
    await assignment.save();

    const order = await Order.findById(assignment?.order);
    if (!order)
      return NextResponse.json(
        { message: "Order not broadcasted to this delivery Boy" },
        { status: 400 },
      );
    order.assignedDeliveryBoy = deliveryBoyId;
    await order.save();

    // Atul
    await order.populate("assignedDeliveryBoy");
    await emitEventHandler("assign-deliveryBoy", {
      order,
    });
    // Atul

    //removing delivery boy from other broadcasted assignments
    // Except the one assignment he accepted / is currently handling
    await DeliveryAssignment.updateMany(
      {
        _id: { $ne: assignment._id },
        status: "broadcasted",
        broadcastedTo: deliveryBoyId,
      },

      {
        $pull: { broadcastedTo: deliveryBoyId },
      },
    );

    return NextResponse.json(
      { message: "order accepted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `error while updating accepting assignment ${error}` },
      { status: 501 },
    );
  }
}
