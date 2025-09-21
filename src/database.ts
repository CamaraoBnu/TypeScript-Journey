import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  throw new Error("❌ Database Environment variables were not set properly.");
}

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: DB_HOST,
  port: Number(DB_PORT || 5432),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  models: [__dirname + "/models"],
  logging: false,
});
