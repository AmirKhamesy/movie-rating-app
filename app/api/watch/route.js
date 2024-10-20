import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import axios from "axios";

const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_KEY;

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's lists and collaborated lists
    const userLists = await prisma.list.findMany({
      where: {
        OR: [
          { userId: userId },
          { collaborators: { some: { userId: userId } } },
        ],
      },
      select: { id: true },
    });

    const listIds = userLists.map((list) => list.id);

    // Get highly-rated movies from user's lists and collaborated lists
    const highlyRatedMovies = await prisma.rating.findMany({
      where: {
        listId: { in: listIds },
      },
      select: {
        tmdbId: true,
        title: true,
        scary: true,
        story: true,
        acting: true,
      },
    });

    const filteredHighlyRatedMovies = highlyRatedMovies.filter(
      (movie) => (movie.scary + movie.story + movie.acting) / 3 > 7
    );

    if (filteredHighlyRatedMovies.length < 10) {
      return NextResponse.json({ notEnoughRatings: true }, { status: 200 });
    }

    // Select a random highly-rated movie
    const randomMovie =
      filteredHighlyRatedMovies[
        Math.floor(Math.random() * filteredHighlyRatedMovies.length)
      ];

    // Get details of the random movie to get its region
    const movieDetailsResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${randomMovie.tmdbId}?api_key=${tmdbApiKey}&language=en-US`
    );
    const movieDetails = movieDetailsResponse.data;
    const movieRegion = movieDetails.production_countries[0]?.iso_3166_1;

    // Get recommendations based on the random highly-rated movie
    const recommendationsResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${randomMovie.tmdbId}/recommendations?api_key=${tmdbApiKey}&language=en-US&page=1`
    );
    const recommendations = recommendationsResponse.data.results;

    // Get watched movies from user's lists and collaborated lists
    const watchedMovies = await prisma.rating.findMany({
      where: {
        listId: { in: listIds },
      },
      select: { tmdbId: true },
    });
    const watchedMovieIds = new Set(watchedMovies.map((movie) => movie.tmdbId));

    // Fetch genre list
    const genresResponse = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbApiKey}&language=en-US`
    );
    const genreList = genresResponse.data.genres;
    const genreMap = Object.fromEntries(
      genreList.map((genre) => [genre.id, genre.name])
    );

    // Filter out already watched movies, adult movies, and movies from different regions
    const filteredRecommendations = recommendations
      .filter((movie) => !watchedMovieIds.has(movie.id))
      .map((movie) => ({
        ...movie,
        genres: movie.genre_ids.map((id) => genreMap[id]).filter(Boolean),
      }));

    return NextResponse.json({
      baseMovie: randomMovie,
      recommendations: filteredRecommendations,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
