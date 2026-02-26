import connectDb from "@/lib/db";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, socketId } = await req.json();
    await connectDb();
    const user = await User.findByIdAndUpdate(
      userId,
      { socketId, isOnline: true },
      { new: true },
    );
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Server error while updating socketId ${error}` },
      { status: 501 },
    );
  }
}
