const express = require("express");

const DocumentModel = require("../models/document-model");
const myUploader = require("../config/multer-setup");

const router = express.Router();


router.get("/documents", (req, res, next) => {
  if (req.user === undefined) {
      res.redirect("/login");
      return;
  }

  res.render("documents-views/documents-page");

});

router.post("/documents",
               // "docPhoto" is the input tag's "name" attribute
               //      |
myUploader.single("docPhoto"), (req, res, next) => {
    // redirect to log in if there is no logged in user
    if (req.user === undefined) {
        res.redirect("/login");
        return;
    }

  const theDocument = new DocumentModel({
      name:         req.body.docName,
      description:  req.body.docDescription,
      // "req.user" is the logged in user's document (defined by Passport)
      owner:        req.user._id
  });

  // Users will not always upload a file.
  // If they didn't, "req.file" will be empty.
  if(req.file) {
    // only set the photoUrl if a file was uploaded
    theDocument.set({ photoURL: `/uploads/${req.file.filename}`});
  }

  theDocument.save()
    .then(() => {
       res.redirect("/my-documents");
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/my-documents", (req, res, next) => {
    // redirect to log in if there is no logged in user
    if (req.user === undefined) {
        res.redirect("/login");
        return;
    }

    DocumentModel
      // retrieve all documents owned by the logged in user
      .find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .exec()
      .then((docResults) => {
          res.locals.listOfDocs = docResults;
          res.render("documents-views/documents-page");
      })
      .catch((err) => {
          next(err);
      });
});


module.exports = router;
