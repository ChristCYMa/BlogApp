//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
//use mongoose as database api
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connect to cluster
mongoose.connect("mongodb+srv://admin-christ:adminpassword@cluster0.4ceok.mongodb.net/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

let posts = [];

//create schema for blog post items
const postSchema = {
  name: {
    type: String,
    required: [true, "No title specified, did not add to database"]
  },
  body: String
};

//create mongoose model
const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
//when redirected from compose, need to show posts saved from database
//find posts saved on database
//find({}, callback) finds ALL posts
  Post.find({}, function(err,foundPosts){
    //if no errors, render "home" view with found posts
    if (!err){
      res.render("home", {
        startingContent:homeStartingContent,
        posts: foundPosts
      });
    } else {
      console.log(err);
    }
  })

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  //when composing, make new Post document
  const post = new Post ({
    name: req.body.postTitle,
    body: req.body.postBody
  });

  //save to database
  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});






app.get("/posts/:postID", function(req, res){
  const postID = req.params.postID;

  //when user clicks read more, find post with same title to display on screen
  //look in posts collection for the post id
Post.findOne({_id:postID}, function(err,foundPost){
  if (!err){
    res.render("post", {
      title: foundPost.name,
      content: foundPost.body
    });
  } else {
    console.log(err);
  }
  })
});

let port = process.env.PORT;
    if (port == null || port == "") {
      port = 3000;
    }

    app.listen(port, function() {
      console.log("Server started on port "+port);
    });
