// http://localhost:3000/api/ratings/1234
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

    const { id } = params;
    const rating = await prisma.rating.findUnique({
      where: {
        id,
      },
    });
    if (!rating) {
      return NextResponse.json(
        { message: "No ratings found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rating);
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
    const { id } = params;
    const { title, scary, story, acting } = body;

    const updateRating = await prisma.rating.update({
      where: { id },
      data: {
        title,
        scary,
        story,
        acting,
      },
    });

    if (!updateRating) {
      return NextResponse.json(
        { message: "No ratings found to update" },
        { status: 404 }
      );
    }

    return NextResponse.json(updateRating);
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
    const { id } = params;
    const { title, scary, story, acting } = body;

    const updateRating = await prisma.rating.update({
      where: { id },
      data: {
        title,
        scary,
        story,
        acting,
      },
    });

    if (!updateRating) {
      return NextResponse.json(
        { message: "No ratings found to update" },
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

    const { id } = params;
    const rating = await prisma.rating.delete({
      where: {
        id,
      },
    });

    return NextResponse.json("Rating deleted");
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "DELETE Error" }, { status: 500 });
  }
};
