import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import ShoppingList from "@/models/ShoppingList";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const { searchParams } = new URL(req.url);
    const showHistory = searchParams.get("history") === "true";

    const query = {
      userId: session.user.id,
      ...(showHistory ? {} : { isActive: true }),
    };

    const lists = await ShoppingList.find(query).sort({ createdAt: -1 });
    return NextResponse.json(lists);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const data = await req.json();

    const list = await ShoppingList.create({
      userId: session.user.id,
      ...data,
    });

    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const data = await req.json();
    const { _id, ...updateData } = data;

    const list = await ShoppingList.findOneAndUpdate(
      { _id, userId: session.user.id },
      updateData,
      { new: true }
    );

    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
