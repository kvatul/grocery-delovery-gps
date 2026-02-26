"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import LiveMap from "@/components/LiveMap";
import { ArrowLeft } from "lucide-react";
import { IOrder } from "@/model/order.model";
import { useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";
import DeliveryChat from "@/components/DeliveryChat";

interface ILocation {
  latitude: number;
  longitude: number;
}
const TrackOrder = ({ params }: { params: { orderId: string } }) => {
  const { orderId } = useParams();
  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const [order, SetOrder] = useState<IOrder>();
  useEffect(() => {
    async function getOrder() {
      try {
        const result = await axios.get(`/api/user/get-order/${orderId}`);
        console.log(result.data);
        SetOrder(result.data);
        setUserLocation({
          latitude: result.data.address.latitude,
          longitude: result.data.address.longitude,
        });
        setDeliveryBoyLocation({
          latitude: result.data.assignedDeliveryBoy.location.coordinates[1],
          longitude: result.data.assignedDeliveryBoy.location.coordinates[0],
        });
      } catch (error) {
        console.log(error);
      }
    }
    getOrder();
  }, [userData?._id]);

  useEffect((): any => {
    const socket = getSocket();

    socket.on("update-deliveryBoy-location", ({ userId, location }) => {
      if (
        userId.toString() ===
        (order?.assignedDeliveryBoy as any)?._id.toString()
      ) {
        setDeliveryBoyLocation({
          latitude: location.coordinates[1],
          longitude: location.coordinates[0],
        });
      }
    });
    return () => socket.off("update-deliveryBoy-location");
  }, [order]);

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-green-50 to-white  ">
      <div className="max-w-2xl mx-auto pb-24 ">
        <div className="sticky py-2 flex items-center justify-center gap-2 shadow-lg border-b border-gray-400 z-999 ">
          <button
            className=" bg-white/70 rounded-full px-4 py-1 text-green-600 font-bold
         cursor-pointer flex item-center gap-2 shadow-md hover:scale-105 transition-all duration-200 "
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="font-bold">Track Order</h2>
            <p className="text-gray-700 text-sm">
              {" "}
              order # {order?._id?.toString().slice(-6)}:
              <span className="text-green-600">{order?.status}</span>
            </p>
          </div>
        </div>

        <div className="my-6 border shadow-lg rounded-xl overflow-hidden ">
          <LiveMap
            userLocation={userLocation}
            deliveryBoyLocation={deliveryBoyLocation}
          />
        </div>
        <div>
          <DeliveryChat
            orderId={orderId as any}
            senderId={userData?._id!} // deliveryBoy
            role={userData?.role!}
          />
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
