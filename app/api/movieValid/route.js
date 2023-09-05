// http://localhost:3000/api/movieValid
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import axios from "axios"; // Import axios for making HTTP requests

export async function POST(req) {
  try {
    const { title } = await req.json();

    if (!title) {
      return new NextResponse(JSON.stringify({ error: "No title provided" }), {
        status: 401,
      });
    }

    const existingMovie = await prisma.rating.findFirst({
      where: {
        title: {
          mode: "insensitive",
          equals: title,
        },
      },
    });

    if (existingMovie) {
      return new NextResponse(
        JSON.stringify({ error: "Movie already exists", ...existingMovie })
      );
    }

    const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_KEY;
    const tmdbResponse = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${title}`
    );

    if (
      tmdbResponse.data.results.length > 0 &&
      tmdbResponse.data.results[0].title === title
    ) {
      // Movie exists in TMDB
      return new NextResponse(JSON.stringify(tmdbResponse.data.results[0]));
    } else {
      // Movie not found in TMDB
      return new NextResponse(
        JSON.stringify({ error: "Movie not found in TMDB" }),
        {
          status: 404,
        }
      );
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
