import { faker } from "@faker-js/faker";
import { prisma } from "./lib/prisma";

async function main() {
  // 1. Create publisher first
  const publisher = await prisma.publisher.create({
    data: {
      name: faker.company.name(),
    },
  });

  // 2. Create genres second
  const genre1 = await prisma.genre.create({
    data: { name: faker.book.genre() },
  });

  const genre2 = await prisma.genre.create({
    data: { name: faker.book.genre() },
  });

  // 3. Create author with book, connecting publisher and genres
  const author = await prisma.author.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      books: {
        create: {
          title: faker.book.title(),
          year: faker.number.int({ min: 1900, max: 2024 }),
          publisher: {
            connect: { id: publisher.id },
          },
          genres: {
            connect: [{ id: genre1.id }, { id: genre2.id }],
          },
        },
      },
    },
    include: {
      books: true,
    },
  });

  const user = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    },
  });

  const review = await prisma.review.create({
    data: {
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentence(),
      userId: user.id,
      bookId: author.books[0].id,
    },
  });

  console.log("Created publisher:", publisher);
  console.log("Created genres:", genre1, genre2);
  console.log("Created author:", author);
  console.log("Created user:", user);
  console.log("Created review:", review);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
