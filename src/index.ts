import app from "./app";
import connect from "./utils/db.util";

connect(<string>process.env.MONGO_URI)
  .then(() => {
    console.log("DB commected.");

    app.listen(process.env.PORT, () => {
      console.log("Server is listening.");
    });
  })
  .catch((err) => {
    console.log(err);
  });
