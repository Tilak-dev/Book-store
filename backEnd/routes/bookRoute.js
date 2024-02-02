import express from "express";
import mongoose from "mongoose";
import { Book } from "../models/bookModel.js";

const route = express.Router();

route.post("/", async (req, resp) => {
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
route.get("/:_id", async (req, resp) => {
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
route.put("/:_id", async (req, resp) => {
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

// delete book
route.delete("/:_id", async (req, resp) => {
   try {
      const id = req.params._id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
         return resp
            .status(400)
            .send({ message: "please check you id again or book NOT FOUND" });
      }
  
      const result = await Book.findByIdAndDelete(id);
      if (!result) {
         return resp.status(500).json({ message: "Book not Found " });
      }

      return resp
         .status(200)
         .send({ message: "Book has Deleted from our system" });
   } catch (error) {
      console.log(error.message);
      resp.status(500).send({ message: "an error is occuring" });
   }
});

export default route;
