// http://localhost:3000/api/publicList/obCAti3sdO1
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    const { hash } = params;

    const list = await prisma.list.findMany({
      where: {
        publicHash: {
          equals: hash,
        },
        public: true,
      },
    });

    const listId = list[0]?.id;

    if (listId) {
      const allListRatings = await prisma.list.findUnique({
        include: {
          ratings: true,
        },
        where: {
          id: listId,
        },
      });

      return NextResponse.json(allListRatings);
    } else {
      return NextResponse.json(
        { message: "Problem getting public list data" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "GET Error" }, { status: 500 });
  }
};
