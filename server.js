/********************************************************************************
*  WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html

*  Name: Moustafa Elkerdany  Student ID: 126088244   Date: 5/12/2025
*  Published URL: https://web-322-assignment2-kappa.vercel.app/
********************************************************************************/

require("dotenv").config();
const path = require("path");
const express = require("express");
const clientSessions = require("client-sessions");
const data = require("./modules/projects.js");
const app = express();
const PORT = process.env.PORT || 8080;


// middleware
app.use(express.urlencoded({ extended: true }));

app.use(clientSessions({
    cookieName: "session",
    secret: process.env.SESSIONSECRET,
    duration: 24*60*60*1000,
    activeDuration: 1000*60*5
}));

// make session available in EJS
app.use((req,res,next)=>{
    res.locals.session = req.session;
    next();
});

// view engine + public folder
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));


//LOGIN AUTH 
function ensureLogin(req,res,next){
    if(!req.session.user) return res.redirect("/login");
    next();
}

app.get("/login",(req,res)=> res.render("login",{errorMessage:"",userName:""}));

app.post("/login",(req,res)=>{
    if(req.body.userName === process.env.ADMINUSER &&
       req.body.password === process.env.ADMINPASSWORD){
        req.session.user = { userName:req.body.userName };
        return res.redirect("/solutions/projects");
    }
    res.render("login",{ errorMessage:"Invalid Login", userName:req.body.userName });
});

app.get("/logout",(req,res)=>{ req.session.reset(); res.redirect("/"); });




app.get("/solutions/addProject", ensureLogin,(req,res)=> res.render("addProject"));

app.post("/solutions/addProject", ensureLogin,(req,res)=>{
    data.addProject(req.body)
        .then(()=>res.redirect("/solutions/projects"))
        .catch(err=>res.render("500",{message:err}));
});

app.get("/solutions/editProject/:id", ensureLogin,(req,res)=>{
    data.getProjectById(req.params.id)
        .then(project=>res.render("editProject",{project}))
        .catch(()=>res.status(404).render("404",{message:"Project Not Found"}));
});

app.post("/solutions/editProject", ensureLogin,(req,res)=>{
    data.editProject(req.body.id,req.body)
        .then(()=>res.redirect("/solutions/projects"))
        .catch(err=>res.render("500",{message:err}));
});

app.get("/solutions/deleteProject/:id", ensureLogin,(req,res)=>{
    data.deleteProject(req.params.id)
        .then(()=>res.redirect("/solutions/projects"))
        .catch(err=>res.render("500",{message:err}));
});



data.initialize().then(()=>{

    console.log("DB Ready");

    app.get("/",(req,res)=>{
        data.getAllProjects()
        .then(p=>res.render("home",{projects:p}))
        .catch(()=>res.render("500",{message:"Load Error"}));
    });

    app.get("/about",(req,res)=> res.render("about"));

    app.get("/solutions/projects",(req,res)=>{
        if(req.query.sector){
            data.getProjectsBySector(req.query.sector)
            .then(p=>res.render("projects",{projects:p}))
            .catch(()=>res.render("404",{message:"No Projects"}));
        } else {
            data.getAllProjects()
            .then(p=>res.render("projects",{projects:p}))
            .catch(()=>res.render("500",{message:"Error Loading"}));
        }
    });

    app.get("/solutions/projects/:id",(req,res)=>{
        data.getProjectById(req.params.id)
        .then(p=>res.render("project",{project:p}))
        .catch(()=>res.render("404",{message:"Not Found"}));
    });

    app.get("/500",(req,res)=>res.render("500",{message:"Server Error"}));
    app.use((req,res)=>res.render("404",{message:"Page Not Found"}));

    app.listen(PORT,()=>console.log(`Running → http://localhost:${PORT}`));

});
