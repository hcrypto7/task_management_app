require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const connection = require("./db");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const taskRoute = require("./routes/task");

connection();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/users", userRoute);

app.listen(process.env.PORT || 8080, () =>
  console.log(`Server listening on port ${process.env.PORT}!`)
);
