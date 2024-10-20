const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const prisma = new PrismaClient();

const movies = [
  { title: "The Invisible Man", year: 2020, story: 9, scary: 5, acting: 7 },
  {
    title: "The Mortuary Collection",
    year: 2019,
    story: 7,
    scary: 1,
    acting: 6,
  },
  { title: "Sputnik", year: 2020, story: 5, scary: 2, acting: 7 },
  { title: "His House", year: 2020, story: 9, scary: 7, acting: 9 },
  { title: "Ghost Stories", year: 2017, story: 8, scary: 7, acting: 9 },
  { title: "Southbound", year: 2015, story: 5, scary: 5, acting: 3 },
  { title: "Triangle", year: 2009, story: 4, scary: 2, acting: 3 },
  { title: "The Lodge", year: 2019, story: 7, scary: 3, acting: 8 },
  { title: "Goodnight Mommy", year: 2022, story: 7, scary: 4, acting: 9 },
  { title: "Run", year: 2020, story: 7, scary: 5, acting: 8 },
  { title: "Caveat", year: 2020, story: 8, scary: 8, acting: 6 },
  { title: "The Black Phone", year: 2021, story: 9, scary: 4, acting: 9 },
  { title: "The Awakening", year: 2011, story: 7, scary: 3, acting: 7 },
  { title: "V/H/S 94", year: 2021, story: 1, scary: 3, acting: 0 },
  { title: "Moloch", year: 2022, story: 8, scary: 4, acting: 8 },
  { title: "Antlers", year: 2022, story: 7, scary: 5, acting: 7 },
  { title: "Nope", year: 2022, story: 8, scary: 3, acting: 9 },
  { title: "The Bay", year: 2012, story: 3, scary: 2, acting: 1 },
  { title: "Mad God", year: 2022, story: 7, scary: 3, acting: 5 },
  { title: "Impetigore", year: 2019, story: 9, scary: 5, acting: 8 },
  { title: "Marrowbone", year: 2017, story: 8, scary: 2, acting: 9 },
  {
    title: "The Autopsy of Jane Doe",
    year: 2016,
    story: 8,
    scary: 9,
    acting: 8,
  },
  { title: "The Ritual", year: 2017, story: 10, scary: 9, acting: 10 },
  { title: "Barbarian", year: 2022, story: 7, scary: 6, acting: 9 },
  { title: "The Lighthouse", year: 2019, story: 6, scary: 2, acting: 8 },
  {
    title: "The Taking of Deborah Logan",
    year: 2014,
    story: 6,
    scary: 5,
    acting: 6,
  },
  { title: "Sinister", year: 2012, story: 7, scary: 8, acting: 6 },
  { title: "Oculus", year: 2013, story: 6, scary: 3, acting: 5 },
  { title: "V/H/S 2", year: 2013, story: 3, scary: 3, acting: 2 },
  { title: "Possum", year: 2018, story: 6, scary: 5, acting: 6 },
  { title: "Devil's Pass", year: 2013, story: 4, scary: 5, acting: 4 },
  { title: "Creep", year: 2014, story: 8, scary: 9, acting: 7 },
  { title: "Speak No Evil", year: 2022, story: 7, scary: 2, acting: 5 },
  { title: "Infinity Pool", year: 2023, story: 7, scary: 0, acting: 7 },
  { title: "The Tunnel", year: 2011, story: 5, scary: 6, acting: 4 },
  { title: "Hereditary", year: 2018, story: 7, scary: 6, acting: 8 },
  { title: "The Descent", year: 2005, story: 6, scary: 7, acting: 3 },
  { title: "REC", year: 2007, story: 3, scary: 6, acting: 3 },
  {
    title: "The Blair Witch Project",
    year: 1999,
    story: 5,
    scary: 2,
    acting: 6,
  },
  { title: "Evil Dead Rise", year: 2023, story: 5, scary: 6, acting: 5 },
  { title: "As Above, So Below", year: 2014, story: 9, scary: 7, acting: 6 },
  { title: "The Pyramid", year: 2014, story: 6, scary: 6, acting: 3 },
  { title: "Ouija: Origin of Evil", year: 2016, story: 6, scary: 7, acting: 7 },
  { title: "Smile", year: 2022, story: 8, scary: 7, acting: 6 },
  { title: "The Thing", year: 1982, story: 8, scary: 3, acting: 7 },
  { title: "Bird Box: Barcelona", year: 2023, story: 6, scary: 3, acting: 6 },
  { title: "Bird Box", year: 2018, story: 8, scary: 4, acting: 8 },
  { title: "Babadook", year: 2014, story: 10, scary: 8, acting: 8 },
  {
    title: "Insidious: The Red Door",
    year: 2023,
    story: 7,
    scary: 6,
    acting: 5,
  },
  { title: "Insidious", year: 2010, story: 8, scary: 7, acting: 5 },
  { title: "Beau is Afraid", year: 2023, story: 8, scary: 2, acting: 10 },
  { title: "The Boogeyman", year: 2023, story: 7.5, scary: 9, acting: 6 },
  {
    title: "Gonjiam: Haunted Asylum",
    year: 2018,
    story: 7,
    scary: 9,
    acting: 8,
  },
  { title: "Drag Me to Hell", year: 2009, story: 5, scary: 6, acting: 3 },
  { title: "Silent Hill", year: 2006, story: 8, scary: 6, acting: 5.5 },
  { title: "Talk To Me", year: 2023, story: 8.5, scary: 4, acting: 8 },
  { title: "No One Will Save You", year: 2023, story: 4, scary: 3, acting: 4 },
  { title: "Life", year: 2017, story: 8.5, scary: 2, acting: 8 },
  { title: "Host", year: 2020, story: 8, scary: 8, acting: 6 },
  { title: "V/H/S", year: 2012, story: 6, scary: 6, acting: 5 },
  {
    title: "Hell House LLC: Origins",
    year: 2023,
    story: 5,
    scary: 9,
    acting: 6,
  },
  { title: "A Hole in the Ground", year: 2019, story: 4, scary: 6, acting: 5 },
  { title: "Cobweb", year: 2023, story: 6.5, scary: 5, acting: 8 },
  {
    title: "Await Further Instructions",
    year: 2018,
    story: 5,
    scary: 6,
    acting: 6,
  },
  { title: "Green Room", year: 2015, story: 7, scary: 3, acting: 5 },
  { title: "When Evil Lurks", year: 2023, story: 4, scary: 5, acting: 4 },
  { title: "Orphan", year: 2009, story: 8, scary: 3, acting: 6 },
  {
    title: "Late Night with the Devil",
    year: 2023,
    story: 3,
    scary: 1,
    acting: 2,
  },
  {
    title: "A Quiet Place: Day One",
    year: 2024,
    story: 7,
    scary: 3,
    acting: 8,
  },
];

async function getTmdbId(title, year) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie`,
      {
        params: {
          api_key: process.env.NEXT_PUBLIC_TMDB_KEY,
          query: title,
          year: year,
        },
      }
    );
    if (response.data.results.length > 0) {
      return response.data.results[0].id;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching TMDB ID for ${title}:`, error);
    return null;
  }
}

async function main() {
  // Find the main user
  const user = await prisma.user.findUnique({
    where: { email: "iknubs@gmail.com" },
  });

  if (!user) {
    console.error(
      "Main user not found. Please ensure a user with email 'iknubs@gmail.com' exists."
    );
    process.exit(1);
  }

  // Find the collaborator
  const collaborator = await prisma.user.findUnique({
    where: { email: "test1@test.com" },
  });

  if (!collaborator) {
    console.error(
      "Collaborator not found. Please ensure a user with email 'test1@test.com' exists."
    );
    process.exit(1);
  }

  // Create the Horror List
  const horrorList = await prisma.list.create({
    data: {
      name: "Horror List",
      public: true,
      user: {
        connect: { id: user.id },
      },
    },
  });

  // Add collaborator
  await prisma.collaborator.create({
    data: {
      listId: horrorList.id,
      userId: collaborator.id,
    },
  });

  // Add movies to the list
  for (const movie of movies) {
    const tmdbId = await getTmdbId(movie.title, movie.year);
    await prisma.rating.create({
      data: {
        title: movie.title,
        scary: movie.scary,
        story: movie.story,
        acting: movie.acting,
        tmdbId: tmdbId,
        list: {
          connect: { id: horrorList.id },
        },
      },
    });
  }

  console.log("Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
