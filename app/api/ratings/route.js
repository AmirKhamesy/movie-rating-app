//http://localhost:3000/api/ratings
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export const POST = async (req) => {
  try {
    //Check if user is auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
      });
    }

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
    //Check if user is auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
      });
    }

    const rating = await prisma.rating.findMany();

    return NextResponse.json(rating);
  } catch (error) {
    return NextResponse.json({ message: "GET Error" }, { status: 500 });
  }
};
