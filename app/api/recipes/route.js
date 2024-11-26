import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import WeeklyRecipe from "@/models/Recipe";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const data = await req.json();

    const weeklyRecipe = await WeeklyRecipe.create({
      userId: session.user.id,
      ...data,
    });

    return NextResponse.json(weeklyRecipe);
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

    const weeklyRecipe = await WeeklyRecipe.findOneAndUpdate(
      {
        _id,
        userId: session.user.id,
      },
      updateData,
      { new: true }
    );

    if (!weeklyRecipe) {
      return NextResponse.json(
        { error: "Receta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(weeklyRecipe);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const { searchParams } = new URL(req.url);
    const weekStart = searchParams.get("weekStart");

    const query = {
      userId: session.user.id,
    };

    if (weekStart) {
      const start = new Date(weekStart);
      const end = new Date(start);
      end.setDate(end.getDate() + 7);

      query.weekStart = {
        $gte: start,
        $lt: end,
      };
    }

    const recipes = await WeeklyRecipe.find(query).sort({ weekStart: -1 });
    return NextResponse.json(recipes);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
