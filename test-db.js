require("dotenv").config();
require("pg");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,         // we can change this later if needed
    port: 5432,                       // we will test this first
    dialect: "postgres",
    dialectModule: require("pg"),
    logging: false,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    }
  }
);

sequelize.authenticate()
  .then(() => console.log("Connection Successful"))
  .catch(err => console.error("Connection Failed:", err));
