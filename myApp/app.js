var express = require('express');
var path = require('path');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// app.get('/', function(req, res){
//   res.render('index', {title: "express"})
// });
////////////////////////////////////// --- LOGIN START --- ///////////////////////////////////////////////////
app.get('/', function(req, res){
  res.render('login', {title: "login"}) 
});
app.post('/', function(req, res){
  var username = req.body.username;
  var password = req.body.password;

  // add part where we compare these variables to the credentials 
  // present in our database
})
////////////////////////////////////// --- LOGIN END --- ///////////////////////////////////////////////////


////////////////////////////////////// --- HOME START --- ///////////////////////////////////////////////////
app.get('/home', function(req, res){
res.render('home')
});
app.get('/phones', function(req, res){
  res.render('phones')
})
app.get('/books', function(req, res){
  res.render('books')
})
app.get('/sports', function(req, res){
  res.render('sports')
})
app.get('/cart', function(req, res){
  res.render('cart')
})

////////////////////////////////////// --- HOME END --- ///////////////////////////////////////////////////

////////////////////////////////////// --- PHONES START --- ///////////////////////////////////////////////////
app.get('/galaxy', function(req, res){
  res.render('galaxy')
});
app.get('/iphone', function(req, res){
  res.render('iphone')
})
////////////////////////////////////// --- PHONES END --- ///////////////////////////////////////////////////


////////////////////////////////////// --- BOOKS START --- ///////////////////////////////////////////////////
app.get('/leaves', function(req, res){
  res.render('leaves')
})
app.get('/sun', function(req, res){
  res.render('sun')
})

////////////////////////////////////// --- BOOKS END --- ///////////////////////////////////////////////////

////////////////////////////////////// --- SPORTS START --- ///////////////////////////////////////////////////
app.get('/boxing', function(req, res){
  res.render('boxing')
})
app.get('/tennis', function(req, res){
  res.render('tennis')
})
////////////////////////////////////// --- SPORTS END --- ///////////////////////////////////////////////////

app.listen(3000);

