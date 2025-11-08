/********************************************************************************
*  WEB322 – Assignment 02
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Moustafa Elkerdany Student ID:126088244 Date: 7/11/2025
*
*  Published URL: https://web-322-assignment2-kappa.vercel.app/
*
********************************************************************************/

const path = require("path"); 
const projectData = require("./modules/projects");
const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;


//EJS view engine
app.set("view engine", "ejs");                          
app.set("views", path.join(__dirname, "views"));        

//static files 
app.use(express.static(path.join(__dirname, "public"))); 

projectData.initialize()
    .then(() => {
        console.log("Project data initialized successfully.");

        // GET Home Page
        app.get("/", (req, res) => {
            projectData.getAllProjects()
                .then(projects => res.render("home", { projects }))
                .catch(() => res.status(500).send("Failed to load projects"));
        });

        // GET About Page
        app.get("/about", (req, res) => res.render("about"));

        // GET "/solutions/projects/:id"
        app.get("/solutions/projects/:id", (req, res) => {
            const id = parseInt(req.params.id);
            projectData.getProjectById(id)
                .then(project => res.render("project", { project }))
                .catch(err => res.status(404).render("404", { message: "Sorry, we're unable to find what you're looking for" }));
        });

        // GET "/solutions/projects" 
        app.get("/solutions/projects", (req, res) => {
            if (req.query.sector) {
                projectData.getProjectsBySector(req.query.sector)
                .then(projects => {
                    res.render("projects", { projects });
                })
                .catch(err => {
                    res.status(404).render("404", { message: "Sorry, we're unable to find what you're looking for" });
                });
            } else {
                projectData.getAllProjects()
                .then(projects => {
                    res.render("projects", { projects });
                })
                .catch(err => {
                    res.status(500).render("404", { message: "Failed to load all projects." });
                });
            }
        });


        //404 Page 
        app.use((req, res) => {
            res.status(404).render("404", { message: "Sorry, we're unable to find what you're looking for" });
        });

        app.listen(HTTP_PORT, () => {
            console.log(`Server is running on port ${HTTP_PORT}`);
        });
    })
    .catch(err => console.log("Initialization failed:", err));
