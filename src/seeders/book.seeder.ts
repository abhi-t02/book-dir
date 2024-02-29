import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
dotenv.config();

import Book from "../models/book.model";
import connect from "../utils/db.util";
import mongoose from "mongoose";

function createFakeBooks(rowCounts: number) {
  const data = [];

  for (let i = 0; i < rowCounts; i++) {
    data.push({
      author: faker.person.fullName(),
      title: faker.lorem.word(),
      genre: faker.helpers.arrayElement([
        "Action",
        "Fiction",
        "Comedy",
        "Adventure",
        "Education",
        "Romance",
      ]),
      publicationYear: faker.date.anytime(),
    });
  }

  return data;
}

connect(<string>process.env.MONGO_URI)
  .then(async () => {
    const data = createFakeBooks(10);
    await Book.insertMany(data);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    mongoose.disconnect();
  });
