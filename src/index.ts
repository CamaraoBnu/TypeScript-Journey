import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./database";
import userRoutes from "./routes/userRoutes";
import workShiftRoutes from "./routes/workShiftRoutes";
import timeEntriesRoutes from "./routes/timeEntriesRoutes";

dotenv.config();

const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("System Running 🚀");
});

//Routes
app.use("/users", userRoutes);
app.use("/workshifts", workShiftRoutes);
app.use("/user-timeEntry", timeEntriesRoutes); 

sequelize.authenticate()
  .then(async () => {
    console.log("Postgres connection established successfully.");
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("Postgres connection error:", err);

  });
