//http://localhost:3000/api/ratings
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { title, scary, story, acting } = body;

    const newRating = await prisma.rating.create({
      data: {
        title,
        scary,
        story,
        acting,
      },
    });

    return NextResponse.json(newRating);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "POST Error" }, { status: 500 });
  }
};

export const GET = async () => {
  try {
    const rating = await prisma.rating.findMany();

    return NextResponse.json(rating);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "GET Error" }, { status: 500 });
  }
};
