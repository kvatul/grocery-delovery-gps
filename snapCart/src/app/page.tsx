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

export default async function Home() {
  await connectDb();
  const session = await auth();
  //console.log(session);
  const user = await User.findById(session?.user?.id as string);
  if (!user) redirect("/login");

  if (!user.role || !user.mobile || (user.role == "user" && !user.mobile))
    return <EditRoleMobile />;

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
        <UserDashBoard />
      ) : (
        <DeliveryMan />
      )}
    </div>
  );
}
