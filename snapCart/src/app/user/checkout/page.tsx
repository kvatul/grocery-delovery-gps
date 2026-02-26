"use client";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
//import L, { LatLngExpression } from "leaflet";
//import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"; //, Marker, Popup
//import "leaflet/dist/leaflet.css";
import axios from "axios";
//import { OpenStreetMapProvider } from "leaflet-geosearch";
import {
  UserRound,
  PhoneCallIcon,
  LocationEdit,
  ArrowLeft,
  ShoppingCart,
  Search,
  LocateFixed,
  Loader2,
  CreditCard,
  CreditCardIcon,
  Truck,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { removeCart } from "@/redux/cartSlice";

import { RootState } from "@/redux/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
//import { auth } from "@/auth";
const CheckOutMap = dynamic(() => import("@/components/CheckOutMap"), {
  ssr: false,
});
interface IDelAddress {
  name: string;
  mobile: string;
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
}

const CheckOut = () => {
  const { userData } = useSelector((state: RootState) => state.user);
  const { subTotal, deliverFee, finalTotal, cartData } = useSelector(
    (state: RootState) => state.cart,
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [delAddress, setDelAddress] = useState<IDelAddress>({
    name: userData?.name as string,
    mobile: userData?.mobile!,
    fullAddress: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [searchMap, setSearchMap] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [payMethod, setPayMethod] = useState("cod");

  useEffect(() => {
    if (userData) {
      //setDelAddress({ ...delAddress, name: userData.name as string | "" });
      //setDelAddress({ ...delAddress, mobile: userData.mobile as string | "" });
      setDelAddress((prev) => ({
        ...prev,
        name: userData?.name || "",
      }));
      setDelAddress((prev) => ({
        ...prev,
        mobile: userData?.mobile || "",
      }));
    }
  }, [userData]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => console.log("location tracking error", err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
      );
    }
  }, []);

  /*   const markerIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
    iconSize: [40, 40],
    iconAnchor: [40, 20],
  }); */

  /*  const DraggableMarker: React.FC = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(position as LatLngExpression, 15, { animate: true });
    }, [map, position]);

    return (
      <Marker
        position={position as LatLngExpression}
        icon={markerIcon}
        draggable={true}
        eventHandlers={{
          dragend: (e: L.LeafletEvent) => {
            const marker = e.target as L.Marker;
            const { lat, lng } = marker.getLatLng();
            setPosition([lat, lng]);
          },
        }}
      />
    );
  }; */

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        if (!position) return;
        const result = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`,
        );
        if (result.data) {
          const data = await result.data;
          //const { address, display_name } = data;

          setDelAddress((prev) => ({
            ...prev,
            city: data.address?.city || "",
            state: data.address?.state || "",
            pincode: data.address?.postcode || "",
            fullAddress: data.display_name || "",
          }));

          //setSearchMap(display_name);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAddress();
  }, [position]);

  const handleSearchMap = async () => {
    setSearchLoading(true);
    try {
      if (!position) return null;
      //const provider = new OpenStreetMapProvider();
      const { OpenStreetMapProvider } = await import("leaflet-geosearch");
      const provider = new OpenStreetMapProvider();
      const result = await provider.search({ query: searchMap });
      //console.log(result);
      if (result) {
        setPosition([result[0].y, result[0].x]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCurrentLoacion = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => console.log("location tracking error", err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
      );
    }
  };

  async function handleOrder() {
    try {
      //const result = await axios("/api/user/order", { paymentMethod: payMethod,address:delAddress });
      if (!position) {
        alert("Please select location on map");
        return;
      }

      const result = await axios.post(
        `/api/user/${payMethod == "cod" ? "order" : "payment"}`,
        {
          userId: userData?._id,
          paymentMethod: payMethod,
          totalAmount: finalTotal,
          address: {
            ...delAddress,
            latitude: position?.[0] || 0,
            longitude: position?.[1] || 0,
          },
          items: cartData.map((item) => ({
            grocery: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            unit: item.unit,
            image: item.image,
          })),
        },
      );
      //console.log(result.data);
      dispatch(removeCart());
      if (payMethod == "cod") {
        router.push("/user/ordersuccess");
      } else {
        window.location.href = result.data.url;
      }
    } catch (error: any) {
      console.log(error.response?.data);
    }
  }

  return (
    <div className="w-[95%] sm:w-[90%] md:w-[75%] mx-auto mb-24 mt-10  ">
      <Link
        href={"/user/cart"}
        className="absolute top-5 left-5 bg-white/70 rounded-full px-4 py-1 text-green-600 font-bold
         cursor-pointer flex item-center gap-2 shadow-md hover:scale-105 transition-all duration-200 "
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="hidden md:flex">Back to Cart</span>
      </Link>
      <motion.h2
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className=" ml-3 text-2xl text-green-600 font-bold text-center shadow-md rounded-xl mt-20 p-1 mb-10 "
      >
        🛒 CheckOut
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5 "
      >
        <div className=" bg-white shadow-2xl p-2 py-1 flex flex-col justify-center rounded-xl ">
          <h1>
            <LocationEdit className=" text-green-400 w-5 h-5 inline-flex mr-2" />
            Delivery Address
          </h1>
          <div className=" relative mt-3  ">
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                //setDelAddress({ ...delAddress, name: e.target.value })
                setDelAddress((prev) => ({ ...prev, name: e.target.value }))
              }
              value={delAddress?.name}
              type="text"
              placeholder="Your Name"
              name=""
              id="1"
              className=" border border-gray-300 rounded-lg w-full p-1 pl-8 focus:ring-2 focus:ring-green-500 focus:outline-none  "
            />
            <UserRound className=" text-green-400 absolute left-2 top-1.5  w-5 h-5" />
          </div>

          <div className=" relative mt-3  ">
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                //setDelAddress({ ...delAddress, mobile: e.target.value })
                setDelAddress((prev) => ({ ...prev, mobile: e.target.value }))
              }
              value={delAddress?.mobile}
              placeholder="mobile"
              name=""
              id="2"
              className=" border border-gray-300 rounded-lg w-full p-1 pl-8 focus:ring-2 focus:ring-green-500 focus:outline-none "
            />
            <PhoneCallIcon className=" text-green-400 absolute left-2 top-1.5  w-5 h-5" />
          </div>
          <div className=" relative mt-3  ">
            <textarea
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDelAddress({ ...delAddress, fullAddress: e.target.value })
              }
              value={delAddress?.fullAddress}
              placeholder="Address"
              className=" border border-gray-300 rounded-lg w-full p-1 pl-8 focus:ring-2 focus:ring-green-500 focus:outline-none "
            />
            <LocationEdit className=" text-green-400 absolute left-2 top-1.5  w-5 h-5" />
          </div>

          <div className="flex justify-between items-center gap-3 ">
            <div className=" relative mt-3  ">
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDelAddress({ ...delAddress, city: e.target.value })
                }
                value={delAddress?.city}
                type="text"
                placeholder="city"
                name=""
                id=""
                className=" border border-gray-300 rounded-lg w-full p-1 pl-8 focus:ring-2 focus:ring-green-500 focus:outline-none "
              />
              <PhoneCallIcon className=" text-green-400 absolute left-2 top-1.5  w-5 h-5" />
            </div>

            <div className=" relative mt-3  ">
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDelAddress({ ...delAddress, state: e.target.value })
                }
                value={delAddress.state}
                type="text"
                placeholder="state"
                name=""
                id=""
                className=" border border-gray-300 rounded-lg w-full p-1 pl-8 focus:ring-2 focus:ring-green-500 focus:outline-none "
              />
              <PhoneCallIcon className=" text-green-400 absolute left-2 top-1.5  w-5 h-5" />
            </div>

            <div className=" relative mt-3  ">
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDelAddress({ ...delAddress, pincode: e.target.value })
                }
                value={delAddress.pincode}
                type="text"
                placeholder="pincode"
                name=""
                id=""
                className=" border border-gray-300 rounded-lg w-full p-1 pl-8 focus:ring-2 focus:ring-green-500 focus:outline-none "
              />
              <Search className=" text-green-400 absolute left-2 top-1.5  w-5 h-5" />
            </div>
          </div>
          <div className="flex justify-between items-center gap-5 ">
            <div className=" w-4/5">
              <div className=" relative mt-3  ">
                <input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchMap(e.target.value)
                  }
                  value={searchMap}
                  type="text"
                  placeholder="search city or area.."
                  name=""
                  id=""
                  className=" border border-gray-300 rounded-lg w-full p-1 pl-2 focus:ring-2 focus:ring-green-500 focus:outline-none "
                />
              </div>
            </div>

            <div className=" w-1/5 text-right">
              <button
                className="bg-green-400 mt-3 py-1 px-6 rounded-full"
                onClick={handleSearchMap}
              >
                {searchLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </div>

          <div className="relative mt-2 p-5 h-[330px] rounded-xl overflow-hidden shadow-inner border border-gray-200 ">
            {position && (
              <CheckOutMap position={position} setPosition={setPosition} />
              /*  <MapContainer
                center={position as LatLngExpression}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full rounded-xl"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  className="h-0.5"
                />
                <DraggableMarker />
              </MapContainer> */
            )}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-10 right-8 bg-green-700 text-white rounded-full shadow-lg
                         hover:bg-green-900 transition-all duration-200 flex justify-center items-center z-999"
              onClick={handleCurrentLoacion}
            >
              <LocateFixed size={22} />
            </motion.button>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className=" relative bg-white shadow-2xl p-2 py-3 flex flex-col h-[275px] rounded-xl  "
        >
          <h1 className=" text-gray-900 font-semibold">
            <CreditCard className=" text-green-400 w-5 h-5 inline-flex mr-2" />
            Payment Method
          </h1>
          <button
            onClick={() => setPayMethod("online")}
            className={`mt-2  font-semibold border rounded-lg py-1 text-left 
              transition-all duration-200  ${payMethod == "online" ? "border-green-200 text-green-700 shadow-md " : " hover:bg-gray-100 "} `}
          >
            <CreditCardIcon className=" text-green-400 w-5 h-5 inline-flex mx-2 " />
            Pay Online (Stripe)
          </button>
          <button
            onClick={() => setPayMethod("cod")}
            className={`mt-2  font-semibold border rounded-lg py-1 text-left 
              transition-all duration-200  ${payMethod == "cod" ? "border-green-200 text-green-700 shadow-md" : "hover:bg-gray-100 "} `}
          >
            <Truck className=" text-green-400 w-5 h-5 inline-flex mx-2 " />
            Cash on Delivery
          </button>
          <hr className="mt-3 text-gray-500" />

          <div className="mt-2 flex justify-between text-xs text-gray-600  ">
            <span className=" ">Subtotal:</span>
            <span className=" ">₹{subTotal}</span>
          </div>

          <div className="mt-2 flex justify-between text-xs text-gray-600">
            <span className=" ">Delivery Fee:</span>
            <span className=" ">₹{deliverFee}</span>
          </div>

          <hr className="mt-3 text-gray-800" />

          <div className="flex justify-between text-lg text-green-500 font-bold mt-1  ">
            <span className=" ">Total:</span>
            <span className=" ">₹{finalTotal}</span>
          </div>

          <motion.button
            className={` mx-auto py-1 my-3 w-[80%] font-semibold flex justify-center gap-1 bg-green-500 hover:bg-green-700
             text-white cursor-pointer rounded-full  transition-all duration-200 shadow-md `}
            whileTap={{ scale: 0.9 }}
            onClick={handleOrder}
          >
            <ShoppingCart className="" />
            {payMethod == "cod" ? "Place Order" : "Pay & Place Order"}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CheckOut;
