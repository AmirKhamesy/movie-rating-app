// http://localhost:3000/api/listValid
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

    const { name } = await req.json();
    const formatedName = name.trim();

    const listExists = await prisma.list.findFirst({
      where: {
        name: {
          mode: "insensitive",
          equals: formatedName,
        },
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });
    return NextResponse.json({ listExists });
  } catch (error) {
    console.log(error);
  }
}
