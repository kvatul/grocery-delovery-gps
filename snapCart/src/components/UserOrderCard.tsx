"use client";
import { useState, useEffect } from "react";
import { IOrder } from "@/model/order.model";
import { motion } from "motion/react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Package,
  CreditCard,
  Truck,
  ChevronUp,
  ChevronDown,
  MapPin,
  UserRound,
  PhoneCall,
  UserCheck,
} from "lucide-react";
import { getSocket } from "@/lib/socket";

interface IAssDelBoy {
  name: string;
  mobile: string;
}

const UserOrderCard = ({ order, role }: { order: IOrder; role: string }) => {
  const statusOptions = ["pending", "out for delivery"];
  const [showItems, setShowItems] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string>("pending");

  const [assDeliveryBoy, setAssDeliveryBoy] = useState<IAssDelBoy>();

  const router = useRouter();
  const upDateStatus = async (orderId: string, status: string) => {
    //console.log(orderid, status);
    try {
      const result = await axios.post(`/api/admin/updorder-status/${orderId}`, {
        status,
      });
      //console.log(result);
      setOrderStatus(status);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setOrderStatus(order.status);
    setAssDeliveryBoy(order.assignedDeliveryBoy as any);
  }, [order]);

  useEffect((): any => {
    const socket = getSocket();
    socket.on("update-order-status", (data) => {
      if (data.orderId.toString() == order?._id!.toString()) {
        setOrderStatus(data.status);
      }
    });
    return () => socket.off("update-order-status");
  }, [order]);

  useEffect((): any => {
    const socket = getSocket();
    socket.on("assign-deliveryBoy", (data) => {
      if (String(data.order._id) == order?._id!.toString()) {
        setAssDeliveryBoy(data.order.assignedDeliveryBoy);
      }
    });
    return () => socket.off("assign-deliveryBoy");
  }, [order]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300 ";
      case "out for delivery":
        return "bg-blue-100 text-blue-700 border-blue-300 ";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-300 ";
      case "default":
        return "bg-gray-100 text-gray-700 border-gray-300 ";
    }
  };
  //console.log("role", role);
  return (
    <div className="w-full py-6 shadow-lg rounded-lg">
      <div className=" flex justify-between items-center bg-green-50 px-8 py-5 rounded-xl shadow-md">
        <div className="">
          <h2 className="flex gap-2">
            <Package className="text-green-600" />
            Order # {order?._id?.toString().slice(-6)}
          </h2>
          <p className="text-xs text-gray-400">
            {new Date(order.createdAt!).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col justify-center ">
          <div className="flex justify-center gap-10">
            {orderStatus != "delivered" && (
              <span
                className={`px-6 py-1 rounded-full ${
                  order?.isPaid
                    ? "text-green-700 border-green-300"
                    : "bg-red-100 text-red-700 border-red-300"
                }`}
              >
                {order?.isPaid ? "Paid" : "Unpaid"}
              </span>
            )}

            <span
              className={`capitalize px-6 py-1 rounded-full bg-amber-100 ${getStatusColor(orderStatus)}`}
            >
              {orderStatus}
            </span>
          </div>
          {role === "admin" && orderStatus != "delivered" ? (
            <div className="flex justify-center">
              <p>{orderStatus}</p>
              <select
                id="catg"
                value={orderStatus}
                className=" border border-gray-300 rounded-lg w-full p-1 pl-4 focus:ring-2 focus:ring-green-500 focus:outline-none "
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  upDateStatus(String(order?._id), e.target.value)
                }
              >
                {statusOptions &&
                  statusOptions.map((opt, index) => (
                    <option key={index} value={opt}>
                      {opt.toLocaleUpperCase()}
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {role === "admin" ? (
        <>
          <div className="mt-5 px-3 flex ">
            <UserRound className="text-green-600" />
            <h1>{order?.address?.name}</h1>
          </div>
          <div className="mt-5 px-3 flex ">
            <PhoneCall className="text-green-600" />
            <h1>{order?.address?.mobile}</h1>
          </div>

          <div className="mt-5 px-3 flex ">
            <MapPin className="text-green-600" />
            <h1>{order?.address?.fullAddress}</h1>
          </div>
        </>
      ) : (
        ""
      )}
      <div className="mt-5 px-3 flex">
        <CreditCard className="text-green-700 " />
        <h1 className="capitalize ">
          {order.paymentMethod === "cod"
            ? "Cash on Delivery"
            : "Online Payment"}
        </h1>
      </div>

      {role === "user" ? (
        <div className="mt-5 px-3 flex ">
          <MapPin className="text-green-600" />
          <h1>{order?.address?.fullAddress}</h1>
        </div>
      ) : (
        ""
      )}

      {/*     
      {order.assignedDeliveryBoy && (
        <>
          <div className="mt-5 px-3 flex justify-between ">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <UserCheck className="text-green-600" />
              <div className="font-semibold text-gray-800">
                <p className=" ">
                  Assigned to{" "}
                  <span>{(order.assignedDeliveryBoy as any)?.name}</span>
                </p>
                <p className="text-xs text-gray-600">
                  📞 +91 {(order.assignedDeliveryBoy as any)?.mobile}
                </p>
              </div>
            </div>
            <a
              href={`tel:${(order.assignedDeliveryBoy as any)?.mobile} `}
              className="bg-blue-600 text-white font-semibold rounded-full mr-2 px-8 py-1.5 hover:bg-blue-800 transition-all duration-100 "
            >
              📞Call
            </a>
          </div>

          {role === "user" ? (
            <div className="w-full text-center ">
              <button
                className="inline-flex justify-center text-white bg-green-600 mt-5 rounded-full gap-2 px-10 py-1 "
                onClick={() => router.push(`/user/track-order/${order?._id}`)}
              >
                <Truck className="text-white" />
                Track Your Order
              </button>
            </div>
          ) : (
            ""
          )}
        </>
      )}
 */}

      {assDeliveryBoy && (
        <>
          <div className="mt-5 px-3 flex justify-between ">
            {(orderStatus != "delivered" || role === "admin") && (
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <UserCheck className="text-green-600" />
                <div className="font-semibold text-gray-800">
                  <p className="  ">
                    Assigned to <span>{assDeliveryBoy?.name}</span>
                  </p>
                  <p className="text-xs text-gray-600">
                    📞 +91 {assDeliveryBoy?.mobile}
                  </p>
                </div>
              </div>
            )}
            {orderStatus != "delivered" && (
              <a
                href={`tel:${assDeliveryBoy?.mobile} `}
                className="bg-blue-600 text-white font-semibold rounded-full mr-2 px-8 py-1.5 hover:bg-blue-800 transition-all duration-100 "
              >
                📞Call
              </a>
            )}
          </div>

          {role === "user" && orderStatus != "delivered" && (
            <div className="w-full text-center ">
              <button
                className="inline-flex justify-center text-white bg-green-600 mt-5 rounded-full gap-2 px-10 py-1 "
                onClick={() => router.push(`/user/track-order/${order?._id}`)}
              >
                <Truck className="text-white" />
                Track Your Order
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-5 px-3 flex justify-between ">
        <h1 className="flex gap-2">
          <Package className="text-green-600" />
          {!showItems ? "Show" : "Hide"} {order?.items.length} Items
        </h1>
        <button
          className="text-green-400"
          onClick={() => setShowItems((prev) => !prev)}
        >
          {showItems ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
      <div
        className={`mt-2 bg-white sm:col-span-2 ${!showItems ? "hidden" : ""} `}
      >
        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between px-5 py-2 items-center mb-2 gap-2 border border-black shadow-md rounded-lg"
          >
            <div className="flex items-center gap-5 ">
              <Image
                src={item.image as string}
                alt="item"
                width={75}
                height={75}
                className="rounded-lg"
              />
              <div className="flex flex-col">
                <p className="text-xl font-bold">{item.name}</p>
                <p className="text-xs text-gray-600 -mt-1">
                  {item.quantity} X {item.unit}
                </p>
              </div>
            </div>
            <div className="flex  items-center gap-3 ">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="py-1 nb-2 flex justify-center items-center rounded-full bg-green-50 border 
            border-green-400 px-2 gap-2"
              >
                <span className="min-w-12 bg-green-600 text-white text-center rounded-full ">
                  ₹{Number(item.price) * item.quantity}
                </span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
      <hr className="mt-2" />
      <div className="flex justify-between items-center px-5 mt-3">
        <h1 className="capitalize flex gap-3">
          <Truck className="text-green-700 " />
          Delivery:{orderStatus}{" "}
        </h1>
        <div className="font-bold ">
          <span className=" ">Total </span>
          <span className="min-w-12  text-green-600 text-center ">
            ₹{order.totalAmount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserOrderCard;
