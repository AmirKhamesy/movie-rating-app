// http://localhost:3000/api/colab
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
      });
    }

    const { email, listId } = await req.json();

    if (email === session.user.email) {
      return new NextResponse(
        JSON.stringify({
          error: "Cannot add yourself as a collaberator, please try again.",
        }),
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        email: {
          mode: "insensitive",
          equals: email,
        },
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "No user found with that email." }),
        {
          status: 401,
        }
      );
    }

    const existingCollaboration = await prisma.collaborator.findFirst({
      where: {
        listId,
        userId: user.id,
      },
    });

    if (existingCollaboration) {
      return new NextResponse(
        JSON.stringify({ error: "Collaboration already exists." }),
        {
          status: 400,
        }
      );
    }

    const newCollaberation = await prisma.collaborator.create({
      data: {
        listId,
        userId: user.id,
      },
    });

    return NextResponse.json({ newCollaberation });
  } catch (error) {
    console.log(error);
  }
}
