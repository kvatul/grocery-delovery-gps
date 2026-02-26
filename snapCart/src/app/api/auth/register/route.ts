import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/user.model";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json(
        { message: "either email or password is empty" },
        { status: 400 },
      );
    if (password.length < 3)
      return NextResponse.json(
        { message: "password is less than 3 char" },
        { status: 400 },
      );
    await connectDb();
    let user = await User.findOne({ email });
    if (user)
      return NextResponse.json(
        { message: "User Email already registered" },
        { status: 400 },
      );
    let hashPassword = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashPassword });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: `error creating user ${error}` },
      { status: 501 },
    );
  }
}
