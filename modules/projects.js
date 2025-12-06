const Sequelize = require("sequelize");
require("dotenv").config();

// DB connection
let sequelize = new Sequelize(
    process.env.PGDATABASE,
    process.env.PGUSER,
    process.env.PGPASSWORD,
    {
        host: process.env.PGHOST,
        dialect: "postgres",
        dialectOptions: {
            ssl: { require: true, rejectUnauthorized: false }
        }
    }
);

// Sector table
const Sector = sequelize.define("Sector", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    sector_name: Sequelize.STRING
},{
    timestamps: false
});

// Project table
const Project = sequelize.define("Project",{
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    title: Sequelize.STRING,
    feature_img_url: Sequelize.STRING,
    summary_short: Sequelize.TEXT,
    intro_short: Sequelize.TEXT,
    impact: Sequelize.TEXT,
    original_source_url: Sequelize.STRING
},{
    timestamps:false
});

Project.belongsTo(Sector,{ foreignKey:"sector_id" });



// Initialize

function initialize(){
    return new Promise((resolve,reject)=>{
        sequelize.sync()
        .then(()=>resolve())
        .catch(err=>reject(err));
    });
}



// All Projects

function getAllProjects(){
    return new Promise((resolve,reject)=>{
        Project.findAll({ include:[Sector], order:["id"] })
        .then(data=>resolve(data))
        .catch(()=>reject("Unable to fetch projects"));
    });
}



// Project by ID

function getProjectById(id){
    return new Promise((resolve,reject)=>{
        Project.findAll({ where:{ id:id }, include:[Sector] })
        .then(data=>{
            if(data.length>0) resolve(data[0]);
            else reject("Project not found");
        })
        .catch(()=>reject("Error fetching project"));
    });
}



// Filter by Sector

function getProjectsBySector(sector){
    return new Promise((resolve,reject)=>{
        Project.findAll({
            include:[Sector],
            where:{
                "$Sector.sector_name$": { [Sequelize.Op.iLike]: `%${sector}%` }
            }
        })
        .then(data=>{
            if(data.length>0) resolve(data);
            else reject("No projects found for selected sector");
        })
        .catch(()=>reject("Error loading sector"));
    });
}



// ADD

function addProject(projectData){
    return new Promise((resolve,reject)=>{
        for(let key in projectData){
            if(projectData[key] === "") projectData[key] = null;
        }
        Project.create(projectData)
        .then(()=>resolve())
        .catch(err=>reject(err.errors[0].message));
    });
}



// EDIT

function editProject(id, projectData){
    return new Promise((resolve,reject)=>{
        for(let key in projectData){
            if(projectData[key] === "") projectData[key] = null;
        }
        Project.update(projectData,{ where:{ id:id }})
        .then(()=>resolve())
        .catch(err=>reject(err.errors ? err.errors[0].message : err));
    });
}



// DELETE

function deleteProject(id){
    return new Promise((resolve,reject)=>{
        Project.destroy({ where:{ id:id }})
        .then(()=>resolve())
        .catch(err=>reject(err.errors ? err.errors[0].message : err));
    });
}



module.exports = {
    initialize,
    getAllProjects,
    getProjectById,
    getProjectsBySector,
    addProject,
    editProject,
    deleteProject
};
