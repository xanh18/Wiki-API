//jshint esversion:6
//hides all jshint errors

//assign the npm packages
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

//create a constant for express
const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: false
}));


app.use(express.static("public"));

//connect to the database with mongoose
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});

//create the articleschema for the database
const articleSchema ={
    title: String,
    content: String

};

//create a model 
const Article = mongoose.model("Article", articleSchema);


// connecto to localhost:3000/articles to find articles
app.route("/articles").get(function(req, res){
  Article.find(function(err, foundArticles){
    if (!err){
      res.send(foundArticles);

    }else{

      res.send(err);

    }
    
  });

})

// the post method
.post(function(req,res){

  const newArticle = new Article({

    title: req.body.title,
    content: req.body.content

  });

  newArticle.save(function(err){
    if (!err) {
      res.send("Succesfully added new article")
    } else {
      res.send(err);
    }
  });
})

// the delete method
.delete(function(req,res){
  Article.deleteMany(function(err){
    if (!err) {
      res.send("Succesfully deleted all articles");
      
    } else {
      res.send(err);
    }

  });
});

// single get method
app.route("/articles/:articleTitle")

.get(function(req,res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){

    if (foundArticle) {
      res.send(foundArticle);
      
    } else {
      res.send("no articles found.")
      
    }
  });


})

// single put method
.put(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content:req.body.content},
    {overwrite: true},
    function (err) {

      if (!err) { 
        res.send("Succesfully updated article")
        
      } else {
        res.send(err)
      }
      
    }
  );
})

//single patch method
.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    
  )
})

//single delete method
.delete(function(req,res){

  Article.deleteOne({ title: req.params.articleTitle}, 
    function(err){
      if (!err) {
        res.send("succesfully updated .patch method")
      } else {
        res.send(err)
      }
    })
});

//see if the server is online and give a message
app.listen(3000, function() {
  console.log("Server started on port 3000");
});