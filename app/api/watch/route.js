import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import axios from "axios";

const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_KEY;

const NUMBER_OF_BASE_MOVIES = 5;

export async function GET(req) {
  try {
    console.log("GET request received");
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    console.log(`Fetching recommendations for user: ${userId}`);

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
    console.log(`User's list IDs: ${listIds.join(", ")}`);

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

    console.log(`Found ${highlyRatedMovies.length} rated movies`);

    const filteredHighlyRatedMovies = highlyRatedMovies.filter(
      (movie) => (movie.scary + movie.story + movie.acting) / 3 > 7
    );

    console.log(`${filteredHighlyRatedMovies.length} movies rated above 7`);

    if (filteredHighlyRatedMovies.length < NUMBER_OF_BASE_MOVIES) {
      console.log("Not enough highly rated movies");
      return NextResponse.json({ notEnoughRatings: true }, { status: 200 });
    }

    // Select random highly-rated movies
    const randomMovies = [];
    const moviesCopy = [...filteredHighlyRatedMovies];
    for (let i = 0; i < NUMBER_OF_BASE_MOVIES; i++) {
      const randomIndex = Math.floor(Math.random() * moviesCopy.length);
      randomMovies.push(moviesCopy[randomIndex]);
      moviesCopy.splice(randomIndex, 1);
    }

    console.log(
      `Selected base movies: ${randomMovies.map((m) => m.title).join(", ")}`
    );

    // Get recommendations for the first random movie
    const recommendationsResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${randomMovies[0].tmdbId}/recommendations?api_key=${tmdbApiKey}&language=en-US&page=1`
    );
    const recommendations = recommendationsResponse.data.results;

    console.log(`Fetched ${recommendations.length} recommendations from TMDB`);

    // Get watched movies from user's lists and collaborated lists
    const watchedMovies = await prisma.rating.findMany({
      where: {
        listId: { in: listIds },
      },
      select: { tmdbId: true },
    });
    const watchedMovieIds = new Set(watchedMovies.map((movie) => movie.tmdbId));

    console.log(`User has watched ${watchedMovieIds.size} movies`);

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

    console.log(
      `Returning ${filteredRecommendations.length} filtered recommendations`
    );

    return NextResponse.json({
      baseMovies: randomMovies,
      recommendations: filteredRecommendations,
      baseMovie: {
        id: randomMovies[0].tmdbId,
        title: randomMovies[0].title,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/watch:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    console.log("POST request received");
    const { movieId, previousMovieId } = await req.json();
    console.log(`Fetching recommendations for movie ID: ${movieId}`);
    console.log(`Previous movie ID: ${previousMovieId}`);

    const session = await getServerSession(authOptions);
    if (!session) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    console.log(`User ID: ${userId}`);

    const recommendationsResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${tmdbApiKey}&language=en-US&page=1`
    );
    const recommendations = recommendationsResponse.data.results;

    // Fetch the details of the movie we're getting recommendations for
    const movieDetailsResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbApiKey}&language=en-US`
    );
    const movieDetails = movieDetailsResponse.data;

    console.log(`Fetched ${recommendations.length} recommendations from TMDB`);

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
    console.log(`User's list IDs: ${listIds.join(", ")}`);

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

    // Select random highly-rated movies, excluding the current baseMovie
    const randomMovies = [];
    const moviesCopy = filteredHighlyRatedMovies.filter(movie => movie.tmdbId !== parseInt(movieId));
    for (let i = 0; i < NUMBER_OF_BASE_MOVIES - 1; i++) {
      if (moviesCopy.length === 0) break;
      const randomIndex = Math.floor(Math.random() * moviesCopy.length);
      randomMovies.push(moviesCopy[randomIndex]);
      moviesCopy.splice(randomIndex, 1);
    }

    console.log(
      `Selected base movies: ${randomMovies.map((m) => m.title).join(", ")}`
    );

    // Get watched movies from user's lists and collaborated lists
    const watchedMovies = await prisma.rating.findMany({
      where: {
        listId: { in: listIds },
      },
      select: { tmdbId: true },
    });
    const watchedMovieIds = new Set(watchedMovies.map((movie) => movie.tmdbId));

    console.log(`User has watched ${watchedMovieIds.size} movies`);

    // Fetch genre list
    const genresResponse = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbApiKey}&language=en-US`
    );
    const genreList = genresResponse.data.genres;
    const genreMap = Object.fromEntries(
      genreList.map((genre) => [genre.id, genre.name])
    );

    const filteredRecommendations = recommendations
      .filter(
        (movie) =>
          !watchedMovieIds.has(movie.id) &&
          movie.id !== parseInt(previousMovieId)
      )
      .map((movie) => ({
        ...movie,
        genres: movie.genre_ids.map((id) => genreMap[id]).filter(Boolean),
      }));

    console.log(
      `Returning ${filteredRecommendations.length} filtered recommendations`
    );

    return NextResponse.json({
      recommendations: filteredRecommendations,
      baseMovie: {
        id: movieDetails.id,
        title: movieDetails.title,
      },
      baseMovies: [
        { tmdbId: movieDetails.id, title: movieDetails.title },
        ...randomMovies
      ],
    });
  } catch (error) {
    console.error("Error in POST /api/watch:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
