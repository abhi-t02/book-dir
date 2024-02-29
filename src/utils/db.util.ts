import mongoose from "mongoose";

export default async function connect(uri: string) {
  await mongoose.connect(uri);

  mongoose.connection.on("connected", () => {
    console.log("DB connected.");
  });

  mongoose.connection.on("error", (err) => {
    console.log(err);
  });
}
