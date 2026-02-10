import { Dialect, Sequelize } from "sequelize";
import { ENV } from "@/core/config/env";

const isTest = ENV.NODE_ENV === "test";

const sequelize = isTest
  ? new Sequelize({ dialect: "sqlite", storage: ":memory:", logging: false })
  : new Sequelize(ENV.DB_DATABASE, ENV.DB_USERNAME, ENV.DB_PASSWORD, {
      host: ENV.DB_HOST,
      port: ENV.DB_PORT,
      dialect: ENV.DB_DIALECT as Dialect,
      logging: ENV.NODE_ENV === "development" ? console.log : false,
    });

export default sequelize;
