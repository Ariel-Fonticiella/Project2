const express = require("express");

const UserModel = require("../models/user-model");
const ForumModel = require("../models/forum-model");


const router = express.Router();


// STEP #1: show the create a new review form
router.get("/forums/:userId/forums/new", (req, res, next) => {
    // retrieve the forum document to display its details next to the form
    ForumModel.findById(req.params.userId)
      .then((UserFromDb) => {
          res.locals.UserDetails = UserFromDb;

          res.render("forum-views/forum-page");
      })
      .catch((err) => {
          next(err);
      });
}); // GET /products/:prodId/reviews/new

// STEP #2: process the new review submission
router.post("/forums/:userId/reviews", (req, res, next) => {
    // retrieve the product document to make sure the ID is good
    ForumModel.findById(req.params.userId)
      .then((productFromDb) => {
          // now that we know the product ID is good we can create the review
          const theReview = new ReviewModel({
              content:     req.body.reviewContent,
              stars:       req.body.reviewStars,
              authorEmail: req.body.reviewAuthorEmail,
              authorName:  req.body.reviewAuthorName,
              product:     req.params.prodId
          });    //              |
                 // product ID comes from the URL params

          // set up the "productDetails" local variable in case
          // we get validation errors and need to display the form again
          res.locals.productDetails = productFromDb;

          // and save the new review to the database
          // (return the promise of the next database operation)
          return theReview.save();
      })
      .then(() => {
          // STEP #3: redirect after a SUCCESSFUL save
          // redirect to the product details page
          res.redirect(`/forum/${req.params.userId}`);
            // you CAN'T redirect to an EJS file
            // you can ONLY redirect to a URL
      })
      .catch((err) => {
          // is this a validation error?
          // if it is then display the form with the error messages
          if (err.errors) {
              res.locals.validationErrors = err.errors;
              res.render("forum-views/forum-page");
          }
          // if it isn't then render the error page with our error
          else {
              next(err);
          }
      });
}); // POST /products/:prodId/reviews


module.exports = router;
