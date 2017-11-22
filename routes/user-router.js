const express   = require("express");
const bcrypt    = require("bcrypt");
const passport  = require("passport");

const UserModel = require("../models/user-model");

const router = express.Router();

// STEP #1: Show the sign up form
router.get("/signup", (req, res, next) => {
    // redirect to home if you are already logged in
    if (req.user) {
        res.redirect("/");

        // early return to stop the function since there's an error
        // prevent the rest of the code from running.
        return;
      }
      res.render("user-views/signup-page");
});

//STEP #2: process the sign up form
router.post("/process-signup", (req, res, next) => {
    if (req.body.signupPassword === ""      ||
        req.body.signupPassword.length < 11 ||
        req.body.signupPassword.match(/[^a-z0-9]/i) === null
      ){                        //          |
                                // no special characters
          // display the form again if it is
          res.locals.errorMessage = "Password is invalid";
          res.render("user-views/signup-page");
          // early return to stop the function since there's an error
          // prevent the rest of the code from running.
          return;
      }
      // query the database to see if the email is taken
      UserModel.findOne({ email: req.body.signupEmail })
        .then((userFromDb) => {
          // userFromDb will be null if the email IS NOT taken

          // display the form again if the email is taken
          if (userFromDb !== null) {
            res.locals.errorMessage = "Email is Taken";
            res.render("user-views/signup-page");

            // early return to stop the function since there's an error
            // prevent the rest of the code from running.
            return;
          }

          // generate a new salt for this user's password
          const salt = bcrypt.genSaltSync(10);

          // encrypted the password submitted from the form
          //                                             |
          const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

          const theUser = new UserModel({
            userName:          req.body.signupUserName,
            encryptedPassword: scrambledPassword,
            email:             req.body.signupEmail
          });

          // return the promise of the next database query
          // to continue the sequence
          return theUser.save();
        })
            .then(() => {
              // redirect to the home page on a successful sign up
              res.redirect("/");
            })
            .catch((err) => {
                next(err);
            });
}); // POST /process-signup

//STEP #1: show the login form
router.get("/login", (req, res, next) => {
  // redirect to home if you are already logged in
  if (req.user) {
      res.redirect("/");

      // early return to stop the function since there's an error
      // prevent the rest of the code from running.
      return;
    }
    res.render("user-views/login-page");
});

//STEP #2: process the log in form
router.post("/process-login", (req, res, next) => {
    // find a user documetn in the database with that UserName
    UserModel.findOne({ userName: req.body.loginUserName })
      .then((userFromDb) => {
          // if we didn't find a user
          if (userFromDb === null) {
              //disply the form again because the UserName is wrong
              res.locals.errorMessage = "No Such Username";
              res.render("user-views/login-page");

              // early return to stop the function since there's an error
              // prevent the rest of the code from running.
              return;
          }
          // if UserName is correct now we check the password
          const isPasswordGood =
            bcrypt.compareSync(req.body.loginPassword, userFromDb.encryptedPassword);

          if (isPasswordGood === false) {
              res.locals.errorMessage = "Incorrect Password";
              res.render("user-views/login-page");

              // early return to stop the function since there's an error
              // prevent the rest of the code from running.
              return;
          }
          //CREDENTIALS ARE GOOD! We need to log the user in.

          // Passport defines the "req.login()"
          // for us to specify when to login a user into the sesison.
          req.login(userFromDb, (err) => {
            // check to see if the log in worked
            if (err) {
                // if it didn't work show the error page
                next(err);
            }
            else {
                // if it worked redirect to the forum page
                res.redirect("/forum");
            }
          }); // req.login()
      }) // then()
      .catch((err) => {
            next(err);
      });
});

router.get("/logout", (req, res, next) => {
    // Passport defines the "req.logout()" method
    // for us to specify when to log out a user (clear them from the session)
    req.logout();

    res.redirect("/");
});


module.exports = router;
