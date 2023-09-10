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

    const allListRatings = await prisma.list.findMany({
      include: {
        ratings: true,
      },
      where: {
        userId,
        name,
      },
    });
    return NextResponse.json(allListRatings[0]);
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

    const listId = list[0].id;

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

    const updateRating = await prisma.list.update({
      where: { name, userId },
      data: {
        name: newName,
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
    const list = await prisma.list.delete({
      where: { name, userId },
    });

    return NextResponse.json("List deleted");
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "DELETE Error" }, { status: 500 });
  }
};
