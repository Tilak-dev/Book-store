import express from "express";
import { PORT, MONGO_URL } from "./config.js";
import mongoose from "mongoose";
import route from "./routes/bookRoute.js";
import cors from "cors";

const app = express();

// middleware
app.use(express.json());

// middle where handling
// option 1
// app.use(cors());
// option 2
app.use(
   cors(
      {
         origin: "http://localhost:3000",
         methods: ["GET", "POST", "PUT", "DELETE"],
         allowedHeaders: ["Content-Type"],
      },
   )
);

// middleware
app.use("/books", route);

// app.get("/",(req,resp)=>{
//    console.log(req)
//    return resp.status(400).send("hello man")
// })

mongoose
   .connect(MONGO_URL)
   .then((result) => {
      console.log(`db connected ${result}`);
      app.listen(PORT, () => {
         console.log(`app is listening ${PORT}`);
      });
   })
   .catch((err) => {
      console.log(`errer is occuring ${err}`);
   });
