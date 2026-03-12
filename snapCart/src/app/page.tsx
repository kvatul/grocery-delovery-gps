import connectDb from "@/lib/db";
import { auth } from "@/auth";
import User from "@/model/user.model";
import EditRoleMobile from "@/components/EditRoleMobile";
import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import AdminDashBoard from "@/components/AdminDashBoard";
import UserDashBoard from "@/components/UserDashBoard";
import DeliveryMan from "@/components/DeliveryMan";
import GeoUpdater from "@/components/GeoUpdater";
import InitUser from "@/InitUser";
import Grocery, { Igrocery } from "@/model/grocery.model";

export default async function Home(props: {
  searchParams: Promise<{ q: string; c: string }>;
}) {
  await connectDb();
  const session = await auth();
  //console.log(session);
  const user = await User.findById(session?.user?.id as string);
  if (!user) redirect("/login");

  if (!user.role || !user.mobile || (user.role == "user" && !user.mobile))
    return <EditRoleMobile />;

  const searchParams = await props.searchParams;
  //console.log(searchParams);
  let groceryList: Igrocery[] = [];
  if (user.role === "user") {
    if (searchParams.c) {
      groceryList = await Grocery.find({ category: searchParams?.c });
    } else if (searchParams.q) {
      groceryList = await Grocery.find({
        $or: [
          { name: { $regex: searchParams?.q || "", $options: "i" } },
          { category: { $regex: searchParams?.q || "", $options: "i" } },
        ],
      });
    } else groceryList = await Grocery.find({});
  }
  const plainUser = JSON.parse(JSON.stringify(user));
  //console.log(plainUser);
  return (
    <div>
      <InitUser />
      <Nav user={plainUser} />
      <GeoUpdater userId={plainUser._id} />
      {/*  <Nav
        user={{
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          mobile: user.mobile,
          image: user.image,
        }}
      /> */}
      {user.role == "admin" ? (
        <AdminDashBoard />
      ) : user.role == "user" ? (
        <UserDashBoard groceries={groceryList} />
      ) : (
        <DeliveryMan />
      )}
    </div>
  );
}
