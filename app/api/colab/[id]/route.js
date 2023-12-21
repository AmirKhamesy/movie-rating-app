// http://localhost:3000/api/colab/id
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
      });
    }

    const { id } = params;

    const collaboration = await prisma.collaborator.findFirst({
      where: {
        id: id,
      },
    });

    if (!collaboration) {
      return new NextResponse(
        JSON.stringify({ error: "Collaboration not found." }),
        {
          status: 404,
        }
      );
    }

    await prisma.collaborator.delete({
      where: {
        id: collaboration.id,
      },
    });

    return NextResponse.json({ success: true });
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
