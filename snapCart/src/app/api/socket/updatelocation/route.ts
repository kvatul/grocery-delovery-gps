import connectDb from "@/lib/db";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, location } = await req.json();
    if (!userId || !location)
      return NextResponse.json(
        { message: "missing userId or location" },
        { status: 400 },
      );
    await connectDb();
    const user = await User.findByIdAndUpdate(
      userId,
      { location },
      { new: true },
    );
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }
    return NextResponse.json({ message: "location updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Server error while updating socketId ${error}` },
      { status: 501 },
    );
  }
}
