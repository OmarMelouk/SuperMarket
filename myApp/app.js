var express = require('express');
var path = require('path');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');




var app = express();
var sess ;




// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "secretkey",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


  var { MongoClient } = require ('mongodb');
  var uri = "mongodb+srv://admin:admin@cluster0.knfs4.mongodb.net/SuperMarketDB?retryWrites=true&w=majority"

  // async function addToCart(item){
  //   const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  //   await client.connect();

  //   const UsersTable = await client.db("SuperMarketDB").collection("Users").addOne({name: item})

  //   client.close();
  // }


// app.get('/', function(req, res){
//   res.render('index', {title: "express"})
// });

async function test(){
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  const UsersTable = await client.db("SuperMarketDB").collection("Users").find().toArray();

  console.log(UsersTable);

  client.close();
}
// test();
////////////////////////////////////// --- LOGIN START --- ///////////////////////////////////////////////////
app.get('/', function(req, res){
  sess = req.session;
  res.render('login', {title: "login", error: null}) 


});


app.post('/', function(req, res){
 
  var userIsValid = false;
  var usernameForm = req.body.username;
  var passwordForm = req.body.password;
  var userLog = {username: usernameForm,
              password: passwordForm,
              cart : []}
    
  // console.log(usernameForm + " " + passwordForm)

  async function find(){
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  const UsersTable = await client.db("SuperMarketDB").collection("Users").find().toArray();

  // console.log(UsersTable);

      for(var i = 0; i<UsersTable.length; i++){
        if(usernameForm === UsersTable[i].username && passwordForm === UsersTable[i].password){
          userIsValid = true;
          // session=req.session;
          // session.userid=req.body.username;
          // console.log(req.session)
        }
      }
      if(userIsValid){
        // console.log("function is working")
        res.render('home', {user: userLog ,error: null}) 
        sess.user = userLog;
        console.log(sess.user)
      }
      else{
        
        // show error message 
        errorMessage = "There is no account with the previous credentials"

        res.render("login", {error: errorMessage})
      }
   

   
    client.close();}
  
  find().catch(console.error);});
////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////REGISTER START////////////////////////////////////////////////
app.get('/registration', function(req, res){
  res.render('registration', {error: null} )
})

app.post('/register', function(req, res){
  var newUsername = req.body.username;
  var newPassword = req.body.password;
  var newUser = {username: newUsername,
                 password: newPassword,
                 cart: []};

  // console.log(newUser);               

  async function add(user){
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    
    var test1 = await client.db("SuperMarketDB").collection("Users").find({username : newUsername}).toArray();
    
    if(test1.length === 0){
      await client.db("SuperMarketDB").collection("Users").insertOne(user);
      res.render('home', {user: newUser, error:null });
         sess.user = newUser;
        console.log(sess.user)
    }
    else{
      // input error message saying the username is not unique
      // console.log(test1)
      errorMessage = "This username is already used. Please pick another"
      res.render('registration', {error: errorMessage})
    }

    client.close();
  }
  add(newUser).catch(console.error)

  // res.render('home');
})
///////////////////////////////////////REGISTER END////////////////////////////////////////////////




////////////////////////////////////// --- LOGIN END --- ///////////////////////////////////////////////////


////////////////////////////////////// --- HOME START --- ///////////////////////////////////////////////////
app.get('/home', function(req, res){
  if(sess.user){
    console.log(sess.user);
res.render('home', {error:null, user: sess.user})}
else{
  console.log("not permitted")
  res.send('You must sign in or create an account before accessing this part of the website')
} 
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

  // async function viewCart(){
  //   const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  //   await client.connect();
  
  //   var Cart = await client.db("SuperMarketDB").collection("Users").find({
  //     $and: [
  //        { username: user.username },
  //        { password: user.password }
  //     ]
  //  }).toArray();
  //   console.log(Cart);
  
  // }
  // viewCart();
  if(sess.user){
  res.render('cart', {cart: sess.user.cart})}
  else{
    console.log("not permitted")
    res.send('You must sign in or create an account before accessing this part of the website')
  } 
  })



app.post('/search', function(req, res){
 
  var itemToBeSearched = req.body.Search;
  var found = false;

  async function searchItems(){
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    var searchResult = await client.db("SuperMarketDB").collection("Items").find({name:new RegExp(itemToBeSearched, 'i') }).toArray();

    var resultString = "";

    for(var i = 0; i<searchResult.length; i++){
      resultString += searchResult[i].name + ", ";
      
    }
  
    console.log(searchResult)

    if(searchResult.length>0){
      found = true;
      res.render('searchresults', {isFound: found, result: searchResult})
      // add part where we make a list with the found items in the webpage *********** very important note
    }
    else{
      errorMessage = "No items found"
      res.render('home', {error: errorMessage, user:sess.user})
    }
  
    client.close();
  
  }

  searchItems();
  

})
app.get('/search', function(req, res){
  if(sess.user){

  }
})

/////////////////////////////////////////////CART////////////////////////////////////


app.post('/add-to-cart', function(req, res){
  // sess = req.session;
console.log("We added the Item " + sess.currentItem +" to " + sess.user.username + "'s Cart")
sess.user.cart.push(sess.currentItem)
console.log(sess.user.cart)

 async function addToCart(item){
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const cartUpdate = await client.db("SuperMarketDB").collection("Users").updateOne({username: sess.user.username},{
                                                                                   $set : {cart: sess.user.cart}
                                                                                  } )


    client.close();
  }
  addToCart()})


////////////////////////////////////// --- HOME END --- ///////////////////////////////////////////////////

////////////////////////////////////// --- PHONES START --- ///////////////////////////////////////////////////
app.get('/galaxy', function(req, res){
  if(sess.user){
  res.render('galaxy', {link: 'galaxy'})
  sess.currentItem =  {name: "Galaxy S21 Ultra",
                      link:'galaxy'}}
  else{
    console.log("not permitted")
    res.send('You must sign in or create an account before accessing this part of the website')
  }                       
});
app.get('/iphone', function(req, res){
  if(sess.user){
  res.render('iphone', {link: "iphone"})
  sess.currentItem =  {name: "iPhone 13 Pro",
                      link:'iphone'}}
  else{
    console.log("not permitted")
    res.send('You must sign in or create an account before accessing this part of the website')
  }                      
                    
})
////////////////////////////////////// --- PHONES END --- ///////////////////////////////////////////////////


////////////////////////////////////// --- BOOKS START --- ///////////////////////////////////////////////////
app.get('/leaves', function(req, res){
  if(sess.user){
  res.render('leaves', {link: "leaves"})
  sess.currentItem =  {name: "Leaves of Grass",
                      link:'leaves'}}
  else{
    console.log("not permitted")
    res.send('You must sign in or create an account before accessing this part of the website')
  }                       
})
app.get('/sun', function(req, res){
  if(sess.user){
  res.render('sun', {link: 'sun'})
  sess.currentItem =  {name: "The Sun and Her Flowers",
                      link:'sun'}}
  else{
    console.log("not permitted")
    res.send('You must sign in or create an account before accessing this part of the website')
  }                       
})

////////////////////////////////////// --- BOOKS END --- ///////////////////////////////////////////////////

////////////////////////////////////// --- SPORTS START --- ///////////////////////////////////////////////////
app.get('/boxing', function(req, res){
  if(sess.user){
  res.render('boxing', {link: 'boxing'})
  sess.currentItem =  {name: "Boxing Bag",
                      link:'boxing'}}
  else{
    console.log("not permitted")
    res.send('You must sign in or create an account before accessing this part of the website')
  } 
})
app.get('/tennis', function(req, res){
  if(sess.user){
  res.render('tennis', {link: 'tennis'})
  sess.currentItem =  {name: "Tennis Racket",
                      link:'tennis'}}
  else{
    console.log("not permitted")
    res.send('You must sign in or create an account before accessing this part of the website')
  } 
})
////////////////////////////////////// --- SPORTS END --- ///////////////////////////////////////////////////

if(proccess.env.PORT){
  app.listen(process.env.PORT, function(){console.log("Server started")})
}
else{
  
    app.listen(3000, function(){console.log("Server startedon port 3000")})
  
}


// // MONGO CONNECTION

async function main(){

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



  await client.connect();

  // await client.db('firstdb').createCollection("")

//   var admin = {
//     username: "admin",
//     password: "admin"
//   };

  await client.db("SuperMarketDB").createCollection("Items");

//   var UsersTable = await client.db("SuperMarketDB").collection("Users").find().toArray();

//     // add part where we compare these variables to the credentials 
//     // present in our database
//   })



//   // console.log(UsersTable);
//   // console.log(UsersTable[0].username)
  client.close();
}

// main().catch(console.error)

async function addToItems(){
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  await client.connect();

  await client.db("SuperMarketDB").collection("Items").insertMany(
    [
      {name: "Galaxy S21 Ultra", link: "galaxy"},
      {name: "iPhone 13 Pro", link: "iphone"},
      {name: "Leaves of Grass", link: "leaves"},
      {name: "The Sun and Her Flowers", link: "sun"},
      {name: "Boxing Bag", link: "boxing"},
      {name: "Tennis Racket", link:"tennis"}
    ]);
    client.close();

}

// addToItems().catch(console.error);


async function searchItems(itemSearched){
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  await client.connect();

  

  var searchResult = await client.db("SuperMarketDB").collection("Items").find({name:new RegExp(itemSearched, 'i') }).toArray();

  console.log(searchResult)

  client.close();

}


// console.log(UsersTable); // problem faced: users table is not a global variable
// and therefore we cannot maipulate it 
//outside main function 