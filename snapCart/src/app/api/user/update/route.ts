import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/model/user.model";
export async function PUT(req: NextRequest) {
  try {
    const { role, mobile } = await req.json();
    const session = await auth();
    //console.log("role", role, "mobile", mobile, session?.user?.email);
    await connectDb();
    const user = await User.findOneAndUpdate(
      { email: session?.user?.email },
      { role, mobile },
      { new: true },
    );
    if (!user) {
      return NextResponse.json(
        { message: "user does not exit" },
        { status: 400 },
      );
    }
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error while updating" },
      { status: 500 },
    );
  }
}
