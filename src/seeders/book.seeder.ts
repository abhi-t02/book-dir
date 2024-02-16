import { faker } from "@faker-js/faker";

import Book from "../models/book.model";

async function createFakeBooks(rowCounts: number) {
  try {
    const data = [];

    for (let i = 0; i < rowCounts; i++) {
      data.push({
        author: faker.person.fullName(),
        title: faker.lorem.word(),
        genre: faker.system.fileType(),
        publicationYear: faker.date.anytime(),
      });
    }

    await Book.create(data);
  } catch (err) {
    console.log(err);
  }
}

(async () => {
  await createFakeBooks(10);
})();
