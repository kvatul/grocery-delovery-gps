import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Grocery from "@/model/grocery.model";
import uploadOnCloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "Grocery can be added by Admin only" },
        { status: 400 },
      );
    }
    const formdata = await req.formData();
    //console.log(formdata);
    const name = formdata.get("name") as string;
    const category = formdata.get("category") as string;
    const price = formdata.get("price") as string;
    const unit = formdata.get("unit") as string;

    console.log(name, category, price, unit);

    const file = formdata.get("image") as Blob | null;
    if (!name || !category || !price || !unit) {
      return NextResponse.json(
        { message: "All Input fields are required" },
        { status: 400 },
      );
    }
    let imageUrl;
    if (file) imageUrl = await uploadOnCloudinary(file);

    await connectDb();
    const existGroc = await Grocery.findOne({ name });
    if (existGroc) {
      return NextResponse.json(
        { message: "Grocery alredy exist" },
        { status: 400 },
      );
    }

    const grocery = await Grocery.create({
      name,
      category,
      price,
      unit,
      image: imageUrl,
    });

    if (grocery) {
      return NextResponse.json(grocery, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Error while Adding Grocery" },
      { status: 500 },
    );
  }

  //const formData = await req.formData();
  //const { name, category, price, unit } = formData
  //const name = formData.name;

  //if (!name || !category !)
}
