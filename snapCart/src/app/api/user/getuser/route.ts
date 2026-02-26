import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import { auth } from "@/auth";
import User from "@/model/user.model";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session?.user) {
      return NextResponse.json(
        { message: "session not found" },
        { status: 401 },
      );
    }
    await connectDb();
    const user = await User.findById(session?.user?.id).select("-password");
    /*  const user = await User.findOne({ email: session?.user?.email }).select(
      "-password",
    );
    */
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: `Server error while fetching Data ${error}` },
      { status: 501 },
    );
  }
}
