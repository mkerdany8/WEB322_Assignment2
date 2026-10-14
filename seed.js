/**
 * One-off seed script.
 *
 * Creates the Sector and Project tables and loads them from the JSON files
 * in ./data. Run once against a fresh database:
 *
 *   node seed.js
 *
 * Reads the same PG* variables from .env that the app uses.
 */

require("dotenv").config();
const Sequelize = require("sequelize");
const sectorData = require("./data/sectorData.json");
const projectData = require("./data/projectData.json");

const sequelize = new Sequelize(
    process.env.PGDATABASE,
    process.env.PGUSER,
    process.env.PGPASSWORD,
    {
        host: process.env.PGHOST,
        dialect: "postgres",
        logging: false,
        dialectOptions: {
            ssl: { require: true, rejectUnauthorized: false }
        }
    }
);

const Sector = sequelize.define("Sector", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    sector_name: Sequelize.STRING
}, { timestamps: false });

const Project = sequelize.define("Project", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    title: Sequelize.STRING,
    feature_img_url: Sequelize.STRING,
    summary_short: Sequelize.TEXT,
    intro_short: Sequelize.TEXT,
    impact: Sequelize.TEXT,
    original_source_url: Sequelize.STRING
}, { timestamps: false });

Project.belongsTo(Sector, { foreignKey: "sector_id" });

sequelize
    .sync({ force: true })
    .then(() => Sector.bulkCreate(sectorData))
    .then(() => Project.bulkCreate(projectData))
    .then(() => {
        console.log(`Seeded ${sectorData.length} sectors and ${projectData.length} projects.`);
        return sequelize.close();
    })
    .catch(err => {
        console.error("Seed failed:", err.message);
        process.exit(1);
    });
