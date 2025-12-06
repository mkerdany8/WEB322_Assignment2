require("dotenv").config();
require("pg");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,         
    port: 5432,                       
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
