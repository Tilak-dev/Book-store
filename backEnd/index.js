import express from "express";
import { PORT, MONGO_URL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";

const app = express();

app.use(express.json());

app.post("/books", async (req, resp) => {
   try {
      if (!req.body.title || !req.body.author || !req.body.publishYear) {
         return resp.status(400).send({
            message: "send all required things",
         });
      }
      const newBook = {
         title: req.body.title,
         author: req.body.author,
         publishYear: req.body.publishYear,
      };

      const book = await Book.create(newBook);
      return resp.status(201).send(book);
   } catch (error) {
      console.log(`the error is occuring ${error}`);
      resp.status(500).send({
         message: error.message,
      });
   }
});

// route for get all books from data base items by id
app.get("/books/:_id", async (req, resp) => {
   try {
      const id = req.params._id;
      const book = await Book.findById(id);
      return resp.status(401).json(book);
   } catch (error) {
      console.log(error.message);
      resp.status(500).send({ message: error.message });
   }
});

// update data base
app.put("/books/:_id", async (req, resp) => {
   try {
      if (!req.body.title || !req.body.author || !req.body.publishYear) {
         return resp.status(400).send({
            message: "send all required information ",
         });
      }
      const id = req.params._id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
         return resp
            .status(400)
            .send({ message: "please check you id again or book NOT FOUND" });
      }
      const result = await Book.findById(id);
      if (!result) {
         return resp.status(404).json({ message: "Book not found." });
      }
      result.title = req.body.title;
      result.author = req.body.author;
      result.publishYear = req.body.publishYear;

      const db = await result.save();
      // console.log(db)

      return resp.status(200).send({ message: "Book updated Successfully " });
   } catch (error) {
      console.log(error.message);
      resp.status(500).send({ message: "an erroe is occuring " });
   }
});

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
