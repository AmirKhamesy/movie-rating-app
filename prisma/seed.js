const { hash } = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const password = await hash("test", 12);
  const user = await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      email: "test@test.com",
      name: "Test User",
      password,
    },
  });

  const list = await prisma.list.create({
    data: {
      userId: user.id,
      name: "Test List1",
      ratings: {
        create: [
          {
            title: "Test Movie title1",
            scary: 9,
            story: 8,
            acting: 4,
          },
        ],
      },
    },
  });

  // const rating = await prisma.rating.create({
  //   data: {
  //     title: "Test Movie title1",
  //     scary: 9,
  //     story: 8,
  //     acting: 4,
  //     listId: list.id,
  //   },
  // });

  // const listsThatHaveRatings = await prisma.list.findMany({
  //   include: {
  //     ratings: true,
  //   },
  //   where: {
  //     ratings: {
  //       some: {
  //         listId: {
  //           equals: undefined,
  //         },
  //       },
  //     },
  //   },
  // });

  // const ratingsForList = await prisma.rating.findMany({
  //   where: {
  //     listId: listsThatHaveRatings[0].id,
  //   },
  // });

  console.log({ list });
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
