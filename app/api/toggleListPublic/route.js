// http://localhost:3000/api/toggleListPublic
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
      });
    }

    const { listId } = await req.json();

    const existingList = await prisma.list.findFirst({
      where: {
        id: listId,
        userId: session.user.id,
      },
      select: {
        id: true,
        public: true,
        publicHash: true,
      },
    });

    if (!existingList) {
      return new NextResponse(
        JSON.stringify({ error: "List not found or unauthorized" }),
        {
          status: 404,
        }
      );
    }

    // Toggle the public boolean
    const updatedList = await prisma.list.update({
      where: { id: existingList.id },
      data: {
        public: !existingList.public,
        // Generate a new publicHash if no hash exists
        publicHash: !existingList.publicHash
          ? generateNewHash()
          : existingList.publicHash,
      },
    });

    return NextResponse.json({ updatedList });
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
      }
    );
  }
}

// Function to generate a new 11-character hash
function generateNewHash() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let hash = "";
  for (let i = 0; i < 11; i++) {
    hash += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return hash;
}
