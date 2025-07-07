const express= require('express')
const app= express()
const mongoose= require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const taskModel= require('./models/taskModel.js');
const userModel = require('./models/userModel.js');
const flash= require('connect-flash')
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Set up session first
app.use(session({
  secret: 'secretKeyHere',
  resave: false,
  saveUninitialized: false
}));

// Initialize passport and use session
app.use(passport.initialize());
app.use(passport.session());

// Use passport-local-mongoose for user auth
passport.use(new LocalStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser()) ;

//Set up for flash messaging :~
app.use(flash())
app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currentUser = req.user
        next()
})




const MONGO_URL= "mongodb://127.0.0.1:27017/dropIn"

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("MongoDB connected");

        app.listen(8080, () => {
            console.log("Server is running at http://localhost:8080");
        });
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

main();

//A temporary Logged in middleare:~~~


function authenticateUser(req,res,next){
 if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl
    req.flash('error',"You must be logged in first");
    return res.redirect('/user/login')
    }
    next()
};


// Home route working fine
app.get("/", async (req, res) => {
  try {
    const tasks = await taskModel.find({});
    res.render("home.ejs", { tasks });
  } catch (err) {
    res.status(500).send("Error fetching tasks");
  }
});
//Addnew btn working fine
app.get('/task/addnew',authenticateUser,(req,res)=>{
  res.render('addnew')
})

app.post('/task/addnew',authenticateUser,async (req,res)=>{
  const {task}= req.body
  try {
    const newtask = await  taskModel.create(task);
    res.redirect('/')
  } catch (err){
    console.log(err)
  }

})


// Show route working fine
app.get('/task/:id',authenticateUser,async(req,res)=>{
    const {id}=req.params;
    const task = await taskModel.findById(id)
     res.render('show.ejs',{task})
   
})

//Edit route working fine
app.get('/task/:id/edit',authenticateUser,async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskModel.findById(id);
    if (!task) {
      return res.status(404).send("Task not found");
    }
    res.render('edit.ejs', { task });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.put('/task/:id',authenticateUser,async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority } = req.body;
    
    await taskModel.findByIdAndUpdate(id, { title, description, priority }, { runValidators: true });
    
    res.redirect(`/task/${id}`);
  } catch (err) {
    res.status(500).send("Error updating task");
  }
});

//Delete route
app.get('/task/:id/delete',authenticateUser,async(req,res)=>{
    const {id}=req.params;
    const task= await taskModel.findByIdAndDelete(id)
    
    res.redirect('/')
    console.log(task)
})

//Signup route working fine
app.get("/user/signup",(req,res)=>{
  req.flash('success',"Please signup")
   res.render('signup')
})

app.post('/user/signup', async (req, res) => {
  const { username, password, email, phone } = req.body;

  try {
    const newUser = new userModel({ username, email, phone });
    await userModel.register(newUser, password);
    req.flash("success","You Signed up ")
     
    req.login(newUser, (err) => {
      if (err) return next(err);
      res.redirect('/');
      req.flash("success","You are logged in ")
    });
  } catch (err) {
    console.error(err);
    res.status(400).send("Signup error");
    req.flash("error","Please signup again ")
  }
});

//Login route
app.get("/user/login",(req,res)=>{
  req.flash('success',"Please Login")
    res.render("login")
})

app.post('/user/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login'
}));

app.get('/user/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
    req.flash("success","You are logged out ")
  });
});





// till 07/07 --> User login, signup,logout, flash msgs , addnew are added and working fine

//User authentiation is by passport-local-mongoose