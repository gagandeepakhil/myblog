const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { Console } = require('console');

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://gagan:gagan@blog.xdg5ro5.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000,"localhost",()=>{console.log('server running')}))
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// routes
app.get(__dir+'/', (req, res) => {
  res.redirect(__dir+'views/blogs');
});

app.get(__dir+'/about', (req, res) => {
  res.render(__dir+'about', { title: 'About' });
});

// blog routes
app.get(__dir+'/blogs/create', (req, res) => {
  res.render(__dir+'create', { title: 'Create a new blog' });
});

app.get(__dir+'/blogs', (req, res) => {
  Blog.find().sort({ createdAt: -1 })
    .then(result => {
      res.render(__dir+'index', { blogs: result, title: 'All blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post(__dir+'/blogs', (req, res) => {
  // console.log(req.body);
  const blog = new Blog(req.body);

  blog.save()
    .then(result => {
      res.redirect(__dir+'/blogs');
    })
    .catch(err => {
      console.log(err);
    });
});

app.get(__dir+'/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(result => {
      res.render(__dir+'details', { blog: result, title: 'Blog Details' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.delete(__dir+'/blogs/:id', (req, res) => {
  const id = req.params.id;
  
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect:__dir+'/blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});

// 404 page
app.use((req, res) => {
  res.status(404).render(__dir+'404', { title: '404' });
});
module.exports = app