const express = require("express");

const JudgeModel = require("../models/judge-model");
const ReviewModel = require("../models/review-model");


const router = express.Router();


// STEP #1: show the create a new review form
router.get("/judges/:judgeId/reviews/new", (req, res, next) => {
    // retrieve the judge document to display its details next to the form
    JudgeModel.findById(req.params.judgeId)
      .then((judgeFromDb) => {
          res.locals.judgeDetails = judgeFromDb;

          res.render("review-views/review-form");
      })
      .catch((err) => {
          next(err);
      });
}); // GET /judges/:judgeId/reviews/new

// STEP #2: process the new review submission
router.post("/judges/:judgeId/reviews", (req, res, next) => {
    // retrieve the judge document to make sure the ID is good
    JudgeModel.findById(req.params.judgeId)
      .then((judgeFromDb) => {
          // now that we know the judge ID is good we can create the review
          const theReview = new ReviewModel({
              content:     req.body.reviewContent,
              stars:       req.body.reviewStars,
              userName:    req.body.reviewAuthorName,
              judge:       req.params.judgeId,
          });    //              |
                 // judges ID comes from the URL params

          // set up the "judgeDetails" local variable in case
          // we get validation errors and need to display the form again
          res.locals.judgeDetails = judgeFromDb;

          // and save the new review to the database
          // (return the promise of the next database operation)
          return theReview.save();
      })
      .then(() => {
          // STEP #3: redirect after a SUCCESSFUL save
          // redirect to the judge's details page
          res.redirect(`/judges/${req.params.judgeId}`);
            // you CAN'T redirect to an EJS file
            // you can ONLY redirect to a URL
      })
      .catch((err) => {
          // is this a validation error?
          // if it is then display the form with the error messages
          if (err.errors) {
              res.locals.validationErrors = err.errors;
              res.render("review-views/review-form");
          }
          // if it isn't then render the error page with our error
          else {
              next(err);
          }
      });
}); // POST /judges/:judgeId/reviews


module.exports = router;
