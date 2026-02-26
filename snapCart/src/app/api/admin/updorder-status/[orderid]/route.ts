import connectDb from "@/lib/db";
import Order from "@/model/order.model";
import User, { Iuser } from "@/model/user.model";
import DeliveryAssignment from "@/model/deliveryAssignment.model";
import { NextRequest, NextResponse } from "next/server";
import emitEventHandler from "@/lib/emitEventHandler";

/* export async function POST(
  req: NextRequest,
  { params }: { params: { orderid: string } },
) */

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ orderid: string }> },
) {
  try {
    const { orderid } = await context.params;
    const { status } = await req.json();
    //console.log(orderid, status);
    await connectDb();
    const order = await Order.findById(orderid).populate("user");
    if (!order) {
      return NextResponse.json({ message: "No Order found" }, { status: 400 });
    }
    order.status = status;
    let deliveryPayloadBoys: any = [];
    if (status === "out for delivery" && !order.assignment) {
      const { latitude, longitude } = order.address;
      const nearbyDeliveryBoys = await User.find({
        role: "deliveryman",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 10000, // 10 KM
          },
        },
      });
      const nearByIds = nearbyDeliveryBoys.map((boy) => boy._id);
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignedTo");
      const busyIdsSet = new Set(busyIds.map((id) => String(id)));
      const availableDeliveryBoys = nearbyDeliveryBoys.filter(
        (boy) => !busyIdsSet.has(String(boy._id)),
      );
      const candidates = availableDeliveryBoys.map((boy: any) =>
        String(boy._id),
      );
      if (candidates.length == 0) {
        await order.save();
        await emitEventHandler("update-order-status", {
          orderId: order._id,
          status: order.status,
        });
        return NextResponse.json(
          { message: "No Delivery Boy available now" },
          { status: 200 },
        );
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        broadcastedTo: candidates,
        status: "broadcasted",
      });

      await deliveryAssignment.populate("order");
      for (const boyId of candidates) {
        //console.log("boyId", boyId);
        const boy = await User.findById(boyId);
        //console.log("boy", boy.socketId);
        if (boy.socketId) {
          await emitEventHandler(
            "new-assignment",
            deliveryAssignment,
            boy.socketId,
          );
        }
      }

      order.assignment = deliveryAssignment._id;
      deliveryPayloadBoys = availableDeliveryBoys.map((boy: Iuser) => ({
        id: boy._id,
        name: boy.name,
        mobile: boy.mobile,
        latitude: boy.location.coordinates[1],
        longitude: boy.location.coordinates[0],
      }));
      await deliveryAssignment.populate("order");
    }
    await order.save();
    await order.populate("user");
    await emitEventHandler("update-order-status", {
      orderId: order._id,
      status: order.status,
    });
    return NextResponse.json(
      {
        assignment: order.assignment, // order.assignment?._id by by youtuber
        availableDeliveryBoys: deliveryPayloadBoys,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `error while update order status ${error}` },
      { status: 501 },
    );
  }
}
