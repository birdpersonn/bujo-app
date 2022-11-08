require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")

// import routes
const authRoute = require("./routes/auth")

// commenting
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.get("/api", (req, res) => {
    res.send("to do list server");
});

app.use("/api/auth", authRoute);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected to database");

        app.listen(process.env.PORT, () => {
            console.log(`Server runnin on port ${process.env.PORT}, ya better catch it!`);
        });
    })
    .catch((error) => {
    console.log(error);
});