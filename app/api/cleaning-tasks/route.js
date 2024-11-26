import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import CleaningTask from "@/models/CleaningTask";

export async function POST(req) {
  try {
    await connectMongo();
    const data = await req.json();
    const task = await CleaningTask.create(data);
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectMongo();
    const tasks = await CleaningTask.find().sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectMongo();
    const { id } = params;
    const data = await req.json();

    const task = await CleaningTask.findByIdAndUpdate(
      id,
      {
        ...data,
        completedAt: data.completed ? new Date() : null,
      },
      { new: true }
    );

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
