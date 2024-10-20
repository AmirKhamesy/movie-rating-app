import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";

export const GET = async (req, { params }) => {
  const listOwnerId = params.id;
  const listName = params.listName;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.id;

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

    const list = await prisma.list.findMany({
      where: {
        name: {
          equals: listName,
          mode: "insensitive",
        },
        userId: listOwnerId,
      },
    });

    const listId = list[0]?.id;

    if (listId) {
      const collaboration = await prisma.collaborator.findFirst({
        where: {
          listId,
          userId: userId,
        },
      });

      if (collaboration) {
        const where = {
          listId,
          ...(scary && { scary: { gte: parseInt(scary) } }),
          ...(story && { story: { gte: parseInt(story) } }),
          ...(acting && { acting: { gte: parseInt(acting) } }),
          ...(search && { title: { contains: search, mode: "insensitive" } }),
        };

        const totalCount = await prisma.rating.count({ where });

        const totalPages = Math.ceil(totalCount / perPage);
        const remainingPages = totalPages - page;

        const allListRatings = await prisma.list.findUnique({
          include: {
            ratings: {
              where,
              take: perPage,
              skip: offset,
              orderBy: {
                updatedAt: sort === "newest" ? "desc" : "asc",
              },
            },
            user: {
              select: {
                name: true,
              },
            },
          },
          where: {
            id: listId,
          },
        });

        return NextResponse.json({ ratings: allListRatings, remainingPages });
      } else {
        return NextResponse.json(
          { message: "Collaboration does not exist" },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "Problem getting lists" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "GET Error" }, { status: 500 });
  }
};

export const POST = async (req, { params }) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.id;
    const listOwnerId = params.id;
    const listName = params.listName;

    const list = await prisma.list.findMany({
      where: {
        name: {
          equals: listName,
          mode: "insensitive",
        },
        userId: listOwnerId,
      },
    });

    const listId = list[0]?.id;

    if (listId) {
      const collaboration = await prisma.collaborator.findFirst({
        where: {
          listId,
          userId: userId,
        },
      });

      if (collaboration) {
        const body = await req.json();
        const { title, scary, story, acting, tmdbId } = body;

        const newRating = await prisma.rating.create({
          data: {
            title,
            scary,
            story,
            acting,
            listId,
            tmdbId,
          },
        });

        return NextResponse.json(newRating);
      } else {
        return NextResponse.json(
          { message: "Collaboration does not exist" },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "Problem getting lists" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "POST Error" }, { status: 500 });
  }
};
