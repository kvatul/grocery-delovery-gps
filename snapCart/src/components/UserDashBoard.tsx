import HeroSection from "@/components/HeroSection";
import CategorySlider from "@/components/CategorySlider";
import connectDb from "@/lib/db";
import Grocery from "@/model/grocery.model";
import GroceryItemCard from "@/components/GroceryItemCard";

const UserDashBoard = async () => {
  await connectDb();
  const groceries = await Grocery.find({});
  const groceryObj = JSON.parse(JSON.stringify(groceries));
  return (
    <div>
      <HeroSection />
      <CategorySlider />
      <div className="w-[90%] md:w-[75%] mt-10 mx-auto">
        <h2 className="ml-3 text-2xl text-green-600 font-bold text-center shadow-md rounded-xl p-1">
          Popular Grocery Item
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {groceryObj.map((item: any, index: number) => (
            <GroceryItemCard key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashBoard;
