// http://localhost:3000/api/colab/userId/listName/ratingId
import prisma from "@/app/libs/prismadb";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../auth/[...nextauth]/route";

export const POST = async (req, { params }) => {
  try {
    //Check if user is auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.id;
    const listOwnerId = params.id;
    const listName = params.listName;
    const { ratingId } = params;

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
        const { title, scary, story, acting } = body;

        const updateRating = await prisma.rating.update({
          where: { id: ratingId },
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

export const PATCH = async (req, { params }) => {
  try {
    //Check if user is auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.id;
    const listOwnerId = params.id;
    const listName = params.listName;
    const { ratingId } = params;

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
        const { title, scary, story, acting } = body;

        const updateRating = await prisma.rating.update({
          where: { id: ratingId },
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

export const DELETE = async (req, { params }) => {
  try {
    // Check if user is auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.id;
    const listOwnerId = params.id;
    const listName = params.listName;
    const { ratingId } = params;

    // Find the list
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
      // Check if the user has collaboration on the list
      const collaboration = await prisma.collaborator.findFirst({
        where: {
          listId,
          userId: userId,
        },
      });

      if (collaboration) {
        // Delete the rating
        const deleteRating = await prisma.rating.delete({
          where: { id: ratingId },
        });

        return NextResponse.json(deleteRating);
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
    return NextResponse.json({ message: "DELETE Error" }, { status: 500 });
  }
};
