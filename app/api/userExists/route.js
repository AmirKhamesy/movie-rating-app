// http://localhost:3000/api/userExists
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(req) {
  try {
    const { email } = await req.json();
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
    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
  }
}
