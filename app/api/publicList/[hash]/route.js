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

    const { searchParams } = new URL(req.url);
    const { page = 1 } = Object.fromEntries(searchParams.entries());

    const perPage = 10;
    const offset = (page - 1) * perPage;

    if (listId) {
      const totalCount = await prisma.rating.count({
        where: {
          listId,
        },
      });

      const totalPages = Math.ceil(totalCount / perPage);
      const remainingPages = totalPages - page;

      const allListRatings = await prisma.list.findUnique({
        include: {
          ratings: {
            take: perPage,
            skip: offset,
          },
        },
        where: {
          id: listId,
        },
      });

      return NextResponse.json({ ratings: allListRatings, remainingPages });
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
