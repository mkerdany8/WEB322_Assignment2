const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");

let projects = [];

//Initialize
function initialize() {
    return new Promise((resolve, reject) => {
        try {
            projects = [];
            projectData.forEach((p) => {
                const sector = sectorData.find((s) => s.id === p.sector_id);
                const newProject = {
                    id: p.id,
                    sector_id: p.sector_id,
                    title: p.title,
                    feature_img_url: p.feature_img_url,
                    summary_short: p.summary_short,
                    intro_short: p.intro_short,
                    impact: p.impact,
                    original_source_url: p.original_source_url
                };
                if (sector) {
                    newProject.sector = sector.sector_name;
                } else {
                    newProject.sector = "Unknown";
                }
                projects.push(newProject);
            });
            resolve();
        } catch (err) {
            reject("Initialize project data failed");
        }
    });
}

//getAllProjects
function getAllProjects() {
    return new Promise((resolve, reject) => {
        if (projects.length > 0) {
            resolve(projects);
        } else {
            reject("No projects found");
        }
    });
}

//getProjectById
function getProjectById(projectId) {
    return new Promise((resolve, reject) => {
        const project = projects.find((p) => p.id === projectId);
        if (project) {
            resolve(project);
        } else {
            reject("Unable to find project");
        }
    });
}

//getProjectsBySector
function getProjectsBySector(sector) {
    return new Promise((resolve, reject) => {
        const foundProjects = projects.filter((p) =>
            p.sector.toLowerCase().includes(sector.toLowerCase())
        );
        if (foundProjects.length > 0) {
            resolve(foundProjects);
        } else {
            reject("Unable to find projects");
        }
    });
}

module.exports = { initialize, getAllProjects, getProjectById, getProjectsBySector };

