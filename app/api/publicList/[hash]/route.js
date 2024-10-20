// http://localhost:3000/api/publicList/obCAti3sdO1
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    const { hash } = params;

    const { searchParams } = new URL(req.url);
    const {
      page = 1,
      scary,
      story,
      acting,
      sort = "newest",
      search,
    } = Object.fromEntries(searchParams.entries());

    const perPage = 10;
    const offset = (page - 1) * perPage;

    const list = await prisma.list.findFirst({
      where: {
        publicHash: hash,
        public: true,
      },
    });

    if (!list) {
      return NextResponse.json(
        { message: "Public list not found" },
        { status: 404 }
      );
    }

    const where = {
      listId: list.id,
      ...(scary && { scary: { gte: parseFloat(scary) } }),
      ...(story && { story: { gte: parseFloat(story) } }),
      ...(acting && { acting: { gte: parseFloat(acting) } }),
      ...(search && { title: { contains: search, mode: "insensitive" } }),
    };

    const [totalCount, allListRatings] = await prisma.$transaction([
      prisma.rating.count({ where }),
      prisma.list.findUnique({
        where: { id: list.id },
        include: {
          ratings: {
            where,
            take: perPage,
            skip: offset,
            orderBy: {
              updatedAt: sort === "newest" ? "desc" : "asc",
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / perPage);
    const remainingPages = totalPages - page;

    return NextResponse.json({ ratings: allListRatings, remainingPages });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "GET Error" }, { status: 500 });
  }
};
