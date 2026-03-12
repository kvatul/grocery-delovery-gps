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
    const action = formdata.get("action") as string;
    const id = formdata.get("id") as string;

    if (action === "delete" && id != "") {
      await Grocery.findByIdAndDelete(id, { new: true });
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const name = formdata.get("name") as string;
    const category = formdata.get("category") as string;
    const price = formdata.get("price") as string;
    const unit = formdata.get("unit") as string;

    //console.log(name, category, price, unit, "id", id, "action", action);

    const file = formdata.get("image") as Blob | null;
    if (!name || !category || !price || !unit) {
      return NextResponse.json(
        { message: "All Input fields are required" },
        { status: 400 },
      );
    }

    let imageUrl;
    if (file) imageUrl = await uploadOnCloudinary(file);
    console.log(imageUrl);
    await connectDb();
    if (id === "") {
      const existGrocery = await Grocery.findOne({ name });
      if (existGrocery) {
        return NextResponse.json(
          { message: "Grocery already exist" },
          { status: 400 },
        );
      }
    }
    let grocery;

    if (id != "")
      grocery = await Grocery.findByIdAndUpdate(
        id,
        {
          name,
          category,
          price,
          unit,
          image: imageUrl,
        },
        { new: true },
      );
    else
      grocery = await Grocery.create({
        name,
        category,
        price,
        unit,
        image: imageUrl,
      });

    if (grocery) {
      return NextResponse.json(grocery, { status: id === "" ? 201 : 200 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: `Internal Error while Adding/Updating Grocery ${error}`,
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    /*
    const { searchParams } = new URL(req.url);
    console.log(searchParams);
    const query = searchParams.get("q");
    console.log(query);
    let searchQuery: any = {};
    if (!query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ];
    } */

    await connectDb();
    const groceries = await Grocery.find({}); //({ searchQuery });
    return NextResponse.json(groceries, { status: 201 });
  } catch (error) {
    console.log(`error while getting grocery ${error} `);
  }
}
