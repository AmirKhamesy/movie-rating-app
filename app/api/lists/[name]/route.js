// http://localhost:3000/api/lists/some%20list

import prisma from "@/app/libs/prismadb";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export const GET = async (req, { params }) => {
  try {
    //Check if user is auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
      });
    }

    const { name } = params;
    const userId = session.user.id;

    const list = await prisma.list.findMany({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        userId,
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
    //Check if user is auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
      });
    }

    const body = await req.json();
    const { name } = params;
    const userId = session.user.id;
    const { title, scary, story, acting } = body;

    const list = await prisma.list.findMany({
      where: {
        userId,
        name,
      },
    });

    const listId = list[0]?.id;

    if (!listId) {
      return NextResponse.json({ message: "Problem getting lists" });
    }

    const rating = await prisma.rating.create({
      data: {
        title,
        scary,
        story,
        acting,
        listId: listId,
      },
    });

    if (!rating) {
      return NextResponse.json({ message: "Error while creating new rating." });
    }

    const updatedList = await prisma.list.update({
      where: {
        id: listId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(rating);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "POST Error" }, { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  try {
    //Check if user is auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
      });
    }

    const body = await req.json();
    const { name } = params;
    const userId = session.user.id;
    const { newName } = body;

    const list = await prisma.list.findMany({
      where: {
        userId,
        name,
      },
    });

    const listId = list[0]?.id;

    if (!listId) {
      return NextResponse.json({ message: "Problem getting lists" });
    }
    const formatedName = newName.trim(); //HACK: Query params issue when loading list

    const updateRating = await prisma.list.update({
      where: { id: listId },
      data: {
        name: formatedName,
      },
    });
    if (!updateRating) {
      return NextResponse.json(
        { message: "No list found to update" },
        { status: 404 }
      );
    }

    return NextResponse.json(updateRating);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "POST Error" }, { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    //Check if user is auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
      });
    }

    const { name } = params;
    const userId = session.user.id;

    const list = await prisma.list.findMany({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        userId,
      },
    });

    const listId = list[0]?.id;

    if (listId) {
      const deletedList = await prisma.list.delete({
        where: {
          id: listId,
        },
      });

      return NextResponse.json("List deleted");
    } else {
      return NextResponse.json({ message: "Problem deleting lists" });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "DELETE Error" }, { status: 500 });
  }
};
