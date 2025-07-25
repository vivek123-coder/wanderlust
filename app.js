
if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

const dburl = process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("Hi Vivek I'm Connected");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}


app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
  mongoUrl:dburl,
  crypto :{
    secret : process.env.SECRET,

  },
  touchAfter : 24 * 3600,

});

store.on("error",()=>{
  console.log("Error is mongo section store", error);
});

const sessionOptions = {
  store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie :{
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true,
  }
};

// app.get("/",(req,res)=>{
//     res.send("HI I am root path");
// });


app.use(session(sessionOptions));
app.use(flash());


//code for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;

  next();
});


// app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email : "student@gmail.com",
//     username : "delta-student",
//   });
//  const registeredUser =  await User.register(fakeUser,"HelloWorld");
//  res.send(registeredUser);
// });




app.use("/listings", listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

    app.use((err, req, res, next)=>{
    let {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {err});
    // res.status(statusCode).send(message);
});
app.listen(8000, (req,res)=>{
    console.log("Successful working");
});