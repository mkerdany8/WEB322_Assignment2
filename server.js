/********************************************************************************
*  WEB322 – Assignment 01
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Moustafa Elkerdany Student ID: _126088244_____________ Date: ____18/10/2025
*
********************************************************************************/
const projectData = require("./modules/projects");
const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;


projectData.initialize()
    .then(() => {
        console.log("Project data initialized successfully.");

        // GET
        app.get("/", (req, res) => {
            res.send("Assignment 1: Moustafa Elkerdany - 126088244");
        });

        //●	GET "/solutions/projects"
        app.get("/solutions/projects", (req, res) => {
            projectData.getAllProjects()
                .then((projects) => res.json(projects))
                .catch((err) => res.status(500).send(err));
        });

        //●	GET "/solutions/projects/id-demo"
        app.get("/solutions/projects/id-demo", (req, res) => {
            projectData.getProjectById(1)
                .then((project) => res.json(project))
                .catch((err) => res.status(404).send(err));
        });

        // ●	GET "/solutions/projects/sector-demo"
        app.get("/solutions/projects/sector-demo", (req, res) => {
            projectData.getProjectsBySector("ind")
                .then((projects) => res.json(projects))
                .catch((err) => res.status(404).send(err));
        });

        
        app.listen(HTTP_PORT, () => {
            console.log(`Server is running on port ${HTTP_PORT}`);
        });
    })
    .catch((err) => console.log("Initialization failed:", err));
