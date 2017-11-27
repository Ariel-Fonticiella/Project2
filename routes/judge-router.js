const express = require("express");

const JudgeModel = require("../models/judge-model");
const ReviewModel = require("../models/review-model");


const router = express.Router();


router.get("/search", (req, res, next) => {
    //create a regular expression from the search Term
    // (this allows us to do partial matches)       ignore case
    //                                                    |
    const searchRegex = new RegExp(req.query.userSearch, "i");
    //                                            |
    //                                  /search?userSearch=battery

    JudgeModel // find judges whose "name" matches the search term
      .find({ name: searchRegex})
      .limit(20)
      .exec()
      .then((searchResults) => {
        res.locals.listOfResults = searchResults;

        res.locals.searchTerm = req.query.userSearch; // local variable

        res.render("user-views/search-page");
      })
      .catch((err) => {
          // render the error page with our error
          next(err);
      });
}); // GET /search

router.get("/judges", (req, res, next) => {
    JudgeModel
      .find()
      .limit(25)
      .sort({ dateAdded: -1 })
      .exec()
      .then((judgeResults) => {
          // create a local variable for the view to access the DB results
          res.locals.listOfJudges = judgeResults;

          // render only after the results have been retrieved
          // (the "then()" callback)
          res.render("user-views/judge-list");
      })
      .catch((err) => {
          // render the error page with our error
          next(err);
      });
}); // GET /judges


// STEP #1: show the new judges form
router.get("/judges/new", (req, res, next) => {
    res.render("user-views/judge-form");
}); // GET /judges/new

// STEP #2: process the new judge submission
router.post("/judges", (req, res, next) => {
    const theJudge = new JudgeModel({
        name:        req.body.judgeName,
        circuit:     req.body.judgeCircuit,
        imageUrl:    req.body.judgeImage,
        description: req.body.judgeDescription,
        user_id:     req.user._id,
        dateAdded:   new Date()  // |
    }); // |                     // |
        // fields from         names of the
        // model's schema      input tags

    theJudge.save()
      .then(() => {
          // STEP #3: redirect after a SUCCESSFUL save
          // redirect to the list of judges page
          res.redirect("/judges");
            // you CAN'T redirect to an EJS file
            // you can ONLY redirect to a URL
      })
      .catch((err) => {
          // is this a validation error?
          // if it is then display the form with the error messages
          if (err.errors) {
              res.locals.validationErrors = err.errors;
              res.render("user-views/judge-form");
          }
          // if it isn't then render the error page with our error
          else {
              next(err);
          }
      });
}); // POST /judges


router.get("/judges/details", (req, res, next) => {
    //      /judges/details?judgeId=9999
    //                           |
    //              req.query.judgeId
    // JudgeModel.findOne({ _id: req.query.judgeId })
    JudgeModel.findById(req.query.judgeId)
      .then((judgeFromDb) => {
          // create a local variable for the view to access the DB result
          res.locals.judgeDetails = judgeFromDb;

          res.render("user-views/judge-details");
      })
      .catch((err) => {
          // render the error page with our error
          next(err);
      });
}); // GET /judges/details


// Routes with URL parameters need to be at the BOTTOM
router.get("/judges/:judgeId", (req, res, next) => {
    //      /judges/ 9999
    //                   |
    //      req.params.judgeId
    // JudgesModel.findOne({ _id: req.params.judgeId })
    JudgeModel.findById(req.params.judgeId)
      .then((judgeFromDb) => {
          // create a local variable for the view to access the DB result
          res.locals.judgeDetails = judgeFromDb;

          // now retrieve the reviews from the database
          // (return the promise of the next database operation)
          return ReviewModel.find({ product: req.params.judgeId }).exec();
      })
      .then((reviewResults) => {
          res.locals.listOfReviews = reviewResults;

          res.render("user-views/judge-details");
      })
      .catch((err) => {
          // render the error page with our error
          next(err);
      });
}); // GET /products/:prodId


// STEP #1: show edit form
router.get("/judges/:judgeId/edit", (req, res, next) => {
    // retrieve the document from the database
    JudgeModel.findById(req.params.judgeId)
      .then((judgeFromDb) => {
          // create a local variable for the view to access the DB result
          // (this is so we can pre-fill the form)
          res.locals.judgesDetails = judgeFromDb;

          res.render("user-views/judge-edit");
      })
      .catch((err) => {
          // render the error page with our error
          next(err);
      });
});

// STEP #2: receive edit submission
router.post("/judges/:judgeId", (req, res, next) => {
    // retrieve the document from the database
    JudgeModel.findById(req.params.judgeId)
      .then((judgeFromDb) => {
          // update the document
          judgeFromDb.set({
              name:        req.body.judgeName,
              circuit:     req.body.judgeCircuit,
              imageUrl:    req.body.judgeImage,
              description: req.body.judgeDescription
          }); // |                        |
              // fields from         names of the
              // model's schema      input tags

          // set up the "productDetails" local variable in case
          // we get validation errors and need to display the form again
          res.locals.judgeDetails = judgeFromDb;

          // and then save the updates
          // (return the promise of the next database operation)
          return judgeFromDb.save();
      })
      .then(() => {
          // STEP #3: redirect after a SUCCESSFUL save
          // redirect to the product details page
          res.redirect(`/judges/${req.params.judgeId}`);
            // you CAN'T redirect to an EJS file
            // you can ONLY redirect to a URL
      })
      .catch((err) => {
          // is this a validation error?
          // if it is then display the form with the error messages
          if (err.errors) {
              res.locals.validationErrors = err.errors;
              res.render("user-views/judge-edit");
          }
          // if it isn't then render the error page with our error
          else {
              next(err);
          }
      });
});


// use this or the POST version of deleting (not both)
router.get("/judges/:judgeId/delete", (req, res, next) => {
    JudgeModel.findByIdAndRemove(req.params.judgeId)
      .then((judgeFromDb) => {
          // redirect to the list of products page
          // (you can't see the details of a product that isn't in the DB)
          res.redirect("/judges");
            // you CAN'T redirect to an EJS file
            // you can ONLY redirect to a URL
      })
      .catch((err) => {
          next(err);
      });
});

// use this or the GET version of deleting (not both)
router.post("/judges/:judgeId/delete", (req, res, next) => {
    JudgeModel.findByIdAndRemove(req.params.judgeId)
      .then((judgeFromDb) => {
          // redirect to the list of products page
          // (you can't see the details of a product that isn't in the DB)
          res.redirect("/judges");
            // you CAN'T redirect to an EJS file
            // you can ONLY redirect to a URL
      })
      .catch((err) => {
          next(err);
      });
});


module.exports = router;
