import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function GET() {
  try {
    const publicLists = await prisma.list.findMany({
      where: {
        public: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 10,
      include: {
        user: {
          select: {
            name: true,
          },
        },
        ratings: {
          select: {
            id: true,
          },
        },
      },
    });

    const formattedLists = publicLists.map((list) => ({
      id: list.id,
      name: list.name,
      userName: list.user.name,
      movieCount: list.ratings.length,
      updatedAt: list.updatedAt,
      publicHash: list.publicHash, // Add this line
    }));

    return NextResponse.json(formattedLists);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
