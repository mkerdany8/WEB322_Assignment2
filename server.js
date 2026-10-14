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


// Sector identity. Each sector carries its own colour through cards, chips and
// filters, so the colour communicates which domain a solution acts on. Class
// names are written out in full because the CSS build scans for literal strings.
const SECTORS = {
    "Land Sinks":                      { rule:"bg-land",        chip:"border-land text-land" },
    "Industry":                        { rule:"bg-industry",    chip:"border-industry text-industry" },
    "Transportation":                  { rule:"bg-transport",   chip:"border-transport text-transport" },
    "Electricity":                     { rule:"bg-electricity", chip:"border-electricity text-electricity" },
    "Food, Agriculture, and Land Use": { rule:"bg-food",        chip:"border-food text-food" }
};

app.locals.sector = name => SECTORS[name] || { rule:"bg-muted", chip:"border-rule text-muted" };


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




app.get("/solutions/addProject", ensureLogin,(req,res)=>{
    data.getAllSectors()
        .then(sectors=>res.render("addProject",{sectors}))
        .catch(err=>res.status(500).render("500",{message:err}));
});

app.post("/solutions/addProject", ensureLogin,(req,res)=>{
    data.addProject(req.body)
        .then(()=>res.redirect("/solutions/projects"))
        .catch(err=>res.render("500",{message:err}));
});

app.get("/solutions/editProject/:id", ensureLogin,(req,res)=>{
    Promise.all([ data.getProjectById(req.params.id), data.getAllSectors() ])
        .then(([project,sectors])=>res.render("editProject",{project,sectors}))
        .catch(()=>res.status(404).render("404",{message:"That solution could not be found."}));
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
        .catch(()=>res.status(500).render("500",{message:null}));
    });

    app.get("/about",(req,res)=> res.render("about"));

    app.get("/solutions/projects",(req,res)=>{
        const chosen = req.query.sector || null;
        const list = chosen ? data.getProjectsBySector(chosen) : data.getAllProjects();

        Promise.all([ list.catch(()=>[]), data.getAllSectors() ])
        .then(([projects,sectors])=>res.render("projects",{projects,sectors,activeSector:chosen}))
        .catch(err=>res.status(500).render("500",{message:err}));
    });

    app.get("/solutions/projects/:id",(req,res)=>{
        data.getProjectById(req.params.id)
        .then(p=>res.render("project",{project:p}))
        .catch(()=>res.status(404).render("404",{message:"That solution could not be found."}));
    });

    app.get("/500",(req,res)=>res.render("500",{message:"Server Error"}));
    app.use((req,res)=>res.status(404).render("404",{message:"Check the address, or start from the catalogue."}));

    app.listen(PORT,()=>console.log(`Running → http://localhost:${PORT}`));

}).catch(err=>{

    // Database unreachable. Serve a styled error page instead of letting the
    // process crash, which on a serverless host surfaces as a raw 500.
    console.error("DB init failed:",err);

    app.use((req,res)=>res.status(503).render("500",{message:"The database is currently unavailable. Please try again later."}));

    app.listen(PORT,()=>console.log(`Running in degraded mode on ${PORT}`));

});
