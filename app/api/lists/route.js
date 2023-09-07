//http://localhost:3000/api/list
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
    const { title } = body;

    const newList = await prisma.lists.create({
      data: {
        title,
        userId: session.id,
      },
    });

    return NextResponse.json(newList);
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

    const lists = await prisma.list.findMany({
      where: {
        userId: session.id,
      },
    });

    // Append the number of ratings per list to each list object
    const listsWithRatingsCount = await Promise.all(
      lists.map(async (list) => {
        const RatingsCount = await prisma.rating.count({
          where: {
            listId: list.id,
          },
        });
        return {
          ...list,
          RatingsCount,
        };
      })
    );

    return NextResponse.json(listsWithRatingsCount);
  } catch (error) {
    return NextResponse.json({ message: "GET Error" }, { status: 500 });
  }
};