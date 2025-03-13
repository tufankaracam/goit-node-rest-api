import { Sequelize } from "sequelize";
const sequelize = new Sequelize(
  process.env.DATABASE_POSTGRESQL_URL,
  {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

try {
  await sequelize.authenticate();
  console.log("Database connection successful.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
  process.exit(1);
}

export default sequelize;
