import app from "./app";
import mongoose from "mongoose";

mongoose
  .connect(<string>process.env.MONGODB_URI, {})
  .then((client) => {
    console.log("DB connected..");
    app.listen(process.env.PORT, () => {
      console.log("Server is listening...");
    });
  })
  .catch((err) => {
    console.log(err);
  });
