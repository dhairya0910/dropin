const express= require('express')
const app= express()
const mongoose= require('mongoose');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const taskModel= require('./models/taskModel.js')

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


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


// Home route working fine
app.get("/", async (req, res) => {
  try {
    const tasks = await taskModel.find({});
    res.render("home.ejs", { tasks });
  } catch (err) {
    res.status(500).send("Error fetching tasks");
  }
});

// Show route working fine
app.get('/task/:id',async(req,res)=>{
    const {id}=req.params;
    const task = await taskModel.findById(id)
     res.render('show.ejs',{task})
   
})

//Edit route working fine
app.get('/task/:id/edit', async (req, res) => {
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

app.put('/task/:id', async (req, res) => {
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
app.get('/task/:id/delete',async(req,res)=>{
    const {id}=req.params;
    const task= await taskModel.findByIdAndDelete(id)
    
    res.redirect('/')
    console.log(task)
})


app.get("/signup",(req,res)=>{
    res.send("Signup Here")
})
app.get("/login",(req,res)=>{
    res.send("Login Here")
})




