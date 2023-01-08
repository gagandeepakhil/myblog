const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');

// express app
const app = express();


// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://gagan:gagan@blog.xdg5ro5.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  // .then(result =>{ 
  //   const port = process.env.PORT || 3000;
  //   app.listen(port)})
  // .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// middleware & static files
app.use(express.static(__dirname+'public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});




// blog routes
app.use('/', blogRoutes);

// routes
app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});


// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});

module.exports=app