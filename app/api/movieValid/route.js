// http://localhost:3000/api/movieValid
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import axios from "axios"; // Import axios for making HTTP requests
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function POST(req) {
  try {
    //Check if user is auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
      });
    }

    const { id, listName, userId } = await req.json();

    if (!id || !listName) {
      return new NextResponse(
        JSON.stringify({
          error: "Something went wrong when validating movie title",
        }),
        {
          status: 401,
        }
      );
    }

    const listOwnerId = userId ? userId : session.user.id;
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
      const existingMovie = await prisma.rating.findFirst({
        where: {
          listId: listId,
          tmdbId: id,
        },
      });

      if (existingMovie) {
        return new NextResponse(
          JSON.stringify({ error: "Movie already exists", ...existingMovie })
        );
      }

      const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_KEY;
      const tmdbResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApiKey}`
      );
      const tmdbMovie = tmdbResponse.data;

      if (tmdbMovie) {
        // Movie exists in TMDB
        return new NextResponse(JSON.stringify(tmdbMovie));
      } else {
        // Movie not found in TMDB
        return new NextResponse(
          JSON.stringify({ error: "Movie not found in TMDB" }),
          {
            status: 404,
          }
        );
      }
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
      }
    );
  }
}
