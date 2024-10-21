import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import axios from "axios";

const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_KEY;
const NUMBER_OF_BASE_MOVIES = 5;

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
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
    const highlyRatedMovies = await prisma.rating.findMany({
      where: {
        listId: { in: listIds },
        OR: [
          { scary: { gte: 7 } },
          { story: { gte: 7 } },
          { acting: { gte: 7 } },
        ],
      },
      select: {
        tmdbId: true,
        title: true,
        scary: true,
        story: true,
        acting: true,
      },
    });

    if (highlyRatedMovies.length < NUMBER_OF_BASE_MOVIES) {
      return NextResponse.json({ notEnoughRatings: true }, { status: 200 });
    }

    const randomMovies = highlyRatedMovies
      .sort(() => 0.5 - Math.random())
      .slice(0, NUMBER_OF_BASE_MOVIES);

    const baseMovie = randomMovies[0];
    const recommendationsResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${baseMovie.tmdbId}/recommendations?api_key=${tmdbApiKey}&language=en-US&page=1`
    );
    const recommendations = recommendationsResponse.data.results;

    const watchedMovies = await prisma.rating.findMany({
      where: { listId: { in: listIds } },
      select: { tmdbId: true },
    });
    const watchedMovieIds = new Set(watchedMovies.map((movie) => movie.tmdbId));

    const genresResponse = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbApiKey}&language=en-US`
    );
    const genreMap = Object.fromEntries(
      genresResponse.data.genres.map((genre) => [genre.id, genre.name])
    );

    const filteredRecommendations = recommendations
      .filter((movie) => !watchedMovieIds.has(movie.id))
      .map((movie) => ({
        ...movie,
        genres: movie.genre_ids.map((id) => genreMap[id]).filter(Boolean),
      }));

    return NextResponse.json({
      baseMovies: randomMovies,
      recommendations: filteredRecommendations,
      baseMovie: {
        id: baseMovie.tmdbId,
        title: baseMovie.title,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { movieId } = await req.json();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
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

    const recommendationsResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${tmdbApiKey}&language=en-US&page=1`
    );
    const recommendations = recommendationsResponse.data.results;

    const movieDetailsResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbApiKey}&language=en-US`
    );
    const movieDetails = movieDetailsResponse.data;

    const watchedMovies = await prisma.rating.findMany({
      where: { listId: { in: listIds } },
      select: { tmdbId: true },
    });
    const watchedMovieIds = new Set(watchedMovies.map((movie) => movie.tmdbId));

    const genresResponse = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbApiKey}&language=en-US`
    );
    const genreMap = Object.fromEntries(
      genresResponse.data.genres.map((genre) => [genre.id, genre.name])
    );

    const filteredRecommendations = recommendations
      .filter((movie) => !watchedMovieIds.has(movie.id))
      .map((movie) => ({
        ...movie,
        genres: movie.genre_ids.map((id) => genreMap[id]).filter(Boolean),
      }));

    const randomMovies = await prisma.rating.findMany({
      where: {
        listId: { in: listIds },
        OR: [
          { scary: { gte: 7 } },
          { story: { gte: 7 } },
          { acting: { gte: 7 } },
        ],
      },
      select: {
        tmdbId: true,
        title: true,
      },
      take: NUMBER_OF_BASE_MOVIES - 1,
      orderBy: [{ scary: "desc" }, { story: "desc" }, { acting: "desc" }],
    });

    return NextResponse.json({
      recommendations: filteredRecommendations,
      baseMovie: {
        id: movieDetails.id,
        title: movieDetails.title,
      },
      baseMovies: [
        { tmdbId: parseInt(movieId), title: movieDetails.title },
        ...randomMovies.filter((movie) => movie.tmdbId !== parseInt(movieId)),
      ].slice(0, NUMBER_OF_BASE_MOVIES),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
