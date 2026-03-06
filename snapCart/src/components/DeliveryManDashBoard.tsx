"use client";
import { IDeliveryAssignment } from "@/model/deliveryAssignment.model";
import axios from "axios";
import { useState, useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import LiveMap from "./LiveMap";
import DeliveryChat from "./DeliveryChat";
import { Loader } from "lucide-react";

interface ILocation {
  latitude: number;
  longitude: number;
}

const DeliveryManDashBoard = () => {
  const [assignments, setAssignments] = useState<IDeliveryAssignment[]>([]);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const { userData } = useSelector((state: RootState) => state.user);
  const getBroadcastedAssignment = async () => {
    try {
      const result = await axios.get("/api/delivery/checkassignment");
      console.log(result.data);
      setAssignments(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getActiveOrder = async () => {
    try {
      const result = await axios.get("/api/delivery/current-order");
      //console.log(result);
      if (result.data.active) {
        setShowOtpBox(false);
        setOtp("");
        setActiveOrder(result.data.assignment);
        setUserLocation({
          latitude: result.data.assignment.order.address.latitude,
          longitude: result.data.assignment.order.address.longitude,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect((): any => {
    const socket = getSocket();

    socket.on("update-deliveryBoy-location", ({ userId, location }) => {
      setDeliveryBoyLocation({
        latitude: location.coordinates[1],
        longitude: location.coordinates[0],
      });
    });
    return () => socket.off("update-deliveryBoy-location");
  }, []);

  useEffect(() => {
    getActiveOrder();
    getBroadcastedAssignment();
  }, [userData]);

  useEffect((): any => {
    const socket = getSocket();
    socket.on("new-assignment", (deliveryAssignment) => {
      setAssignments((prev) => [deliveryAssignment, ...prev!]);
    });
    return () => socket.off("new-assignment");
  }, []);

  useEffect(() => {
    if (!userData?._id) return;
    if (!navigator.geolocation) return;
    const socket = getSocket();
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        setDeliveryBoyLocation({
          latitude: latitude,
          longitude: longitude,
        });
        socket.emit("update-location", {
          userId: userData?._id,
          latitude,
          longitude,
        });
      },
      (err) => {
        console.log(err);
      },
      { enableHighAccuracy: true },
    );
  }, [userData?._id]);

  async function handleAccept(assignmentId: string) {
    try {
      const result = await axios.get(
        `/api/delivery/assignment/${assignmentId}/accept-assignment`,
      );
      //console.log(result.data);
      getBroadcastedAssignment();
      getActiveOrder();
    } catch (error) {
      console.log(error);
    }
  }

  async function sendOtp() {
    setSendOtpLoading(true);
    try {
      const result = await axios.post("/api/delivery/otp/send/", {
        orderId: activeOrder.order._id,
      });
      console.log(result.data);
      setShowOtpBox(true);
    } catch (error) {
      console.log(error);
    } finally {
      setSendOtpLoading(false);
    }
  }

  async function verifyOtp() {
    setVerifyOtpLoading(true);
    try {
      const result = await axios.post("/api/delivery/otp/verify/", {
        orderId: activeOrder.order._id,
        otp,
      });
      //console.log(result.data);
      setActiveOrder(null);
      setVerifyOtpLoading(false);
      await getActiveOrder();
    } catch (error) {
      console.log(error);
      setOtpError("Otp verification error");
    } finally {
      setVerifyOtpLoading(false);
    }
  }

  //console.log("activeOrder", activeOrder);
  //console.log("assignments", assignments);

  if (activeOrder && userLocation)
    return (
      <div className="w-full h-screen bg-gray-50 p-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="mt-30 mb-4 text-2xl text-green-600 font-bold text-center shadow-lg rounded-xl ">
            Active Assignment
          </h1>
          <p className="text-sm mb-4 text-gray-700">
            order # {activeOrder.order._id.toString().slice(-6)}
          </p>
          <div className="mb-6 border shadow-lg rounded-xl overflow-hidden ">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>
          <div>
            <DeliveryChat
              orderId={activeOrder.order._id}
              senderId={userData?._id!} // deliveryBoy
              role={userData?.role!}
            />
            <div className="mt-6 bg-white rounded-xl border p-6">
              {!activeOrder.order.otpVerification && !showOtpBox && (
                <button
                  className="w-full p-4 bg-green-600 text-white rounded-lg text-center "
                  onClick={sendOtp}
                >
                  {sendOtpLoading ? (
                    <Loader
                      size={16}
                      className="animate-spin text-white  text-center"
                    />
                  ) : (
                    "Mark as Delivered"
                  )}
                </button>
              )}

              {showOtpBox && (
                <div className="mt-4">
                  <input
                    type="text"
                    className="w-full py-3 border rounded-lg text-center"
                    placeholder="Enter  otp"
                    value={otp}
                    maxLength={4}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg text-center"
                    onClick={verifyOtp}
                  >
                    {verifyOtpLoading ? (
                      <Loader
                        size={16}
                        className="animate-spin text-white text-center "
                      />
                    ) : (
                      "Verify Otp"
                    )}
                  </button>
                  {otpError && (
                    <div className="text-red-600 m-2">{otpError}</div>
                  )}
                </div>
              )}

              {activeOrder.order.otpVerification && (
                <div className="text-green-600  text-center font-bold ">
                  Delivery Completed !
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="w-full h-screen bg-gray-50 p-4 ">
      <div className="max-w-3xl mx-auto">
        <h2 className="mt-30 mb-4 text-2xl text-green-600 font-bold text-center shadow-lg rounded-xl ">
          Delivery Assignment
        </h2>

        {assignments &&
          assignments.length > 0 &&
          assignments.map((ass: any, index) => (
            <div
              key={index}
              className="p-5 bg-white rounded-xl  border mb-4 shadow-lg "
            >
              <p>
                <b>Order Id # </b> {ass?.order?._id.slice(-6)}
              </p>
              <p className="text-gray-600">
                {ass?.order?.address?.fullAddress}
              </p>
              <div className="flex justify-center items-center gap-10 mt-5">
                <button
                  className="text-white bg-green-600 text-xl rounded-full px-10 py-2"
                  onClick={() => handleAccept(ass?._id)}
                >
                  Accept
                </button>
                <button className="text-white bg-red-600 text-xl rounded-full px-10 py-2">
                  Reject
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DeliveryManDashBoard;
