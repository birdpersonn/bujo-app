require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// commenting
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
    res.send("to do list server");
});

app.post("/name", (req, res) => {
    if(req.body.name) {
        return res.json({name: req.body.name});
    } else {
        return res.status(400).json({error: "no name provided"});
    }
});

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