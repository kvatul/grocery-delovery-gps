import connectDb from "@/lib/db";
import { NextResponse } from "next/server";
import User from "@/model/user.model";

export async function GET() {
  try {
    await connectDb();
    const user = (await User.find({ role: "admin" })).length;
    return NextResponse.json(
      { adminExist: user == 0 ? false : true },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `error while checking admin ${error}` },
      { status: 501 },
    );
  }
}
