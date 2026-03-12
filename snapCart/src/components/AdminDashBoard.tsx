import connectDb from "@/lib/db";

import Order from "@/model/order.model";
import User from "@/model/user.model";
import AdminDashBoardClient from "./AdminDashBoardClient";
const AdminDashBoard = async () => {
  await connectDb();
  const order = await Order.find({});
  const user = await User.find({ role: "user" });
  const totalOrder = order.length;
  const totalCustomer = user.length;
  const pendingOrder = order.filter((ord) => ord.status === "pending").length;
  const totalRevenue = order.reduce((sum, corder) => {
    return (sum = sum + (corder.totalAmount || 0));
  }, 0);

  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  const todaysOrder = order.filter(
    (corder) => new Date(corder.createdAt) >= startOfDay,
  );
  const todaysRevenue = todaysOrder.reduce(
    (sum, corder) => (sum = sum + (corder.totalAmount || 0)),
    0,
  );

  const sevenDaysOrder = order.filter(
    (corder) => new Date(corder.createdAt) >= sevenDaysAgo,
  );

  const sevenDaysRevenue = sevenDaysOrder.reduce(
    (sum, corder) => (sum = sum + (corder.totalAmount || 0)),
    0,
  );

  const stats = [
    { title: "Total Order", value: totalOrder },
    { title: "Total Customers", value: totalCustomer },
    { title: "Pending Deliveries", value: pendingOrder },
    { title: "Total Revenue", value: totalRevenue },
  ];

  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const currDate = new Date();
    currDate.setDate(currDate.getDate() - i);
    currDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(currDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const orderCount = order.filter(
      (ord) =>
        new Date(ord.createdAt) >= currDate &&
        new Date(ord.createdAt) <= nextDate,
    ).length;
    chartData.push({
      day: currDate
        .toLocaleDateString("en-US", { weekday: "short" })
        .toString()
        .substring(0, 3),
      orders: orderCount,
    });
  }

  return (
    <div>
      <AdminDashBoardClient
        earning={{
          today: todaysRevenue,
          sevenDays: sevenDaysRevenue,
          total: totalRevenue,
        }}
        stats={stats}
        chartData={chartData}
      />
    </div>
  );
};

export default AdminDashBoard;
