const mongoose = require("mongoose");

module.exports = () => {
  const dbUri = process.env.DATABASE;
  if (!dbUri) {
    console.error(
      "Database connection string (DB) is not defined in environment variables."
    );
    return;
  }

  try {
    mongoose.connect(dbUri);
    console.log("Connected to database successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
    console.log("Could not connect to database");
  }
};
