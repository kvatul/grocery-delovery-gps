import { auth } from "@/auth";
import DeliveryManDashBoard from "./DeliveryManDashBoard";
import Order from "@/model/order.model";

const DeliveryMan = async () => {
  const session = await auth();
  const deliveryBoyId = session?.user?.id;
  const order = await Order.find({
    assignedDeliveryBoy: deliveryBoyId,
    otpVerification: true,
  });
  const today = new Date().toDateString();
  const todayOrder = order.filter(
    (o) => new Date(o.deliveredAt).toDateString() === today,
  );
  const earnings = todayOrder.length * 40;

  console.log("order,today,todayOrder", order.length, today, todayOrder.length);

  return (
    <div>
      <DeliveryManDashBoard earnings={earnings} />
    </div>
  );
};

export default DeliveryMan;
