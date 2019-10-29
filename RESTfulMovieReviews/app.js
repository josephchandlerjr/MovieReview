const express = require("express"),
	  app = express(),
	  ejs = require("ejs"),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  methodOverride = require("method-override");

// APP CONFIG
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static("public"));
// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/restful_movie_app", {useNewUrlParser: true ,useUnifiedTopology: true});

const movieSchema = new mongoose.Schema({title: String,
										  image: String,
										  review: String,
										  created: {type: Date, default: Date.now}});

const Movie = new mongoose.model("Movie", movieSchema);

// Movie.create({title: "Another Title", image: "https://images.unsplash.com/photo-1540431471894-0fe2f6fa383a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60", review: "Super helpful review"}, (err, newMovie) => {
// 	if(err){
// 		console.log(`Error: ${err}`);
// 	} else {
// 		console.log(`Created ${newMovie}`);
// 	}
// });

//INDEX ROUTE
app.get("/movies", (req, res) => {
	Movie.find({}, (err, movies) =>{
		if(err) {
			console.log(`Error is: ${err}`);
		} else {
			res.render("index", {movies});
		}
	});
	
});

app.get("/", (req, res) => res.redirect("/movies"));

//NEW ROUTE
app.get("/movies/new", (req, res) => {
	res.render("new");
});

//CREATE ROUTE
app.post("/movies", (req, res) => {
	Movie.create(req.body.movie, (err, newMovie) =>{
		if(err) {
			console.log(`Error is: ${err}`);
		} else {
			res.redirect("/movies");
		}
	});
});

//SHOW ROUTE
app.get("/movies/:id", (req, res) => {
	Movie.findById(req.params.id, (err, movie) =>{
		if(err) {
			console.log(`Error is: ${err}`);
		} else {
			res.render("show", {movie});
		}
	});
	
});

//EDIT ROUTE

app.get("/movies/:id/edit", (req, res) => {
	Movie.findById(req.params.id, (err, movie) =>{
		if(err) {
			console.log(`Error is: ${err}`);
		} else {
			res.render("edit", {movie});
		}
	});
	
});

//UPDATE ROUTE

app.put("/movies/:id", (req, res) => {
	Movie.findByIdAndUpdate(req.params.id, req.body.movie, (err, movie) =>{
		if(err) {
			console.log(`Error is: ${err}`);
			res.redirect("/movies");
		} else {
			res.redirect(`/movies/${req.params.id}`);
		}
	});
	
});

//DESTROY ROUTE
app.delete("/movies/:id", (req, res) => {
	Movie.findByIdAndRemove(req.params.id, (err) =>{
		if(err) {
			console.log(`Error is: ${err}`);
			res.redirect("/movies");
		} else {
			res.redirect("/movies");
		}
	});
	
});


app.listen(3000, () => console.log("Server Listening"));

