require("dotenv").config();
require("colors");

const PORT = process.env.PORT || 5000;

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/connectDB");

connectDB();

const app =express();

app.use(express.json());

app.use(helmet());

if(process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

app.get("/api/v1/health-check", (req, res) => res.send("CG Tracker API..."));

const server = app.listen(PORT, () => console.log(`Server running at port: ${PORT}.`.yellow.underline));

// handle unhandled rejections
process.on("unhandledRejection", (err) => {
    console.log(err.message);
    server.close(() => process.exit(1))
})
