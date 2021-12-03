var express = require('express');
var path = require('path');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


  var { MongoClient } = require ('mongodb');
  var uri = "mongodb+srv://admin:admin@cluster0.knfs4.mongodb.net/SuperMarketDB?retryWrites=true&w=majority"

  async function addToCart(item){
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const UsersTable = await client.db("SuperMarketDB").collection("Users").addOne({name: item})

    client.close();
  }


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
        }
      }
      if(userIsValid){
        // console.log("function is working")
        res.render('home', {user: userLog ,error: null}) 
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
res.render('home', {error:null})
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

  async function viewCart(){
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    var Cart = await client.db("SuperMarketDB").collection("Users").find({
      $and: [
         { username: user.username },
         { password: user.password }
      ]
   }).toArray();
    console.log(Cart);

  }
  viewCart();
  res.render('cart')
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
      res.render('home', {error: errorMessage})
    }
  
    client.close();
  
  }

  searchItems();
  

})


////////////////////////////////////// --- HOME END --- ///////////////////////////////////////////////////

////////////////////////////////////// --- PHONES START --- ///////////////////////////////////////////////////
app.get('/galaxy', function(req, res){
  res.render('galaxy', {link: 'galaxy'})
});
app.get('/iphone', function(req, res){
  res.render('iphone', {link: "iphone"})
})
////////////////////////////////////// --- PHONES END --- ///////////////////////////////////////////////////


////////////////////////////////////// --- BOOKS START --- ///////////////////////////////////////////////////
app.get('/leaves', function(req, res){
  res.render('leaves', {link: "leaves"})
})
app.get('/sun', function(req, res){
  res.render('sun', {link: 'sun'})
})

////////////////////////////////////// --- BOOKS END --- ///////////////////////////////////////////////////

////////////////////////////////////// --- SPORTS START --- ///////////////////////////////////////////////////
app.get('/boxing', function(req, res){
  res.render('boxing', {link: 'boxing'})
})
app.get('/tennis', function(req, res){
  res.render('tennis', {link: 'tennis'})
})
////////////////////////////////////// --- SPORTS END --- ///////////////////////////////////////////////////

app.listen(3000);



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