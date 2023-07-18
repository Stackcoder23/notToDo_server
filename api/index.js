const express = require("express");

const app = express();

const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

app.get("/", (req, res) => {
    res.send("Welcome to the server");
})

app.get("/user", (req, res) => {
    let db_connect = dbo.getDb();
    db_connect
        .collection("users")
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        })
        .then((data) => {
            res.json(data);
        });
});

app.post("/login", async (req, res) => {
    let db_connect = dbo.getDb();
    let user = await db_connect
        .collection("users")
        .findOne({ email: req.body.email, role: req.body.role });
    if (user) {
        if (user.password == req.body.password)
            res.json(user);
        else
            res.status(400).json({ error: "Incorrect Password" });
    }
    else {
        res.status(400).json({ error: "User doesn't exist" });
    }
});

app.post("/register", async (req, res) => {
    let db_connect = dbo.getDb();
    let user = await db_connect
        .collection("users")
        .insertOne({ email: req.body.email, name: req.body.name, password: req.body.password, role: req.body.role });
    if(user)
    res.send(user)
    else
    res.status(400).json({ error: "Failed to register" });
});

app.get('/tasks', async (req, res) => {
    let db_connect = dbo.getDb();
    db_connect
        .collection("tasks")
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        })
        .then((data) => {
            res.json(data);
        });
})

app.post("/deleteTask", async (req, res) => {
    let db_connect = dbo.getDb();
    let user = await db_connect
        .collection("tasks")
        .deleteOne({ title: req.body.title, description: req.body.description })
        .then((response) => {
            res.json(response)
        })
});

app.post("/insertTask", async (req, res) => {
    let db_connect = dbo.getDb();
    let user = await db_connect
        .collection("tasks")
        .insertOne({ title: req.body.title, description: req.body.description });
    if(user)
    res.send(user)
    else
    res.status(400).json({ error: "Failed to create task" });
});

app.post("/updateTask", async (req, res) => {
    let db_connect = dbo.getDb();
    let user = await db_connect
        .collection("tasks")
        .updateOne({ title: req.body.oldtitle, description: req.body.olddescription }, 
            { $set: { title: req.body.newtitle, description: req.body.newdescription } });
    if(user)
    res.send(user)
    else
    res.status(400).json({ error: "Failed to update task" });
});

app.post("/checkIfAcknowledged", async (req, res) => {
    let db_connect = dbo.getDb();
    let user = await db_connect
        .collection("acknowledgements")
        .findOne({ email: req.body.email, taskTitle: req.body.title });
    if(user)
    res.send(true)
    else
    res.status(400).json({ error: "Not Acknowledged" });
});

app.post("/acknowledge", async (req, res) => {
    let db_connect = dbo.getDb();
    let user = await db_connect
        .collection("acknowledgements")
        .insertOne({ taskTitle: req.body.title, email: req.body.email });
    if(user)
    res.send(user)
    else
    res.status(400).json({ error: "Failed to acknowledge" });
});

app.post("/getAcknowledgeList", (req, res) => {
    let db_connect = dbo.getDb();
    db_connect
        .collection("acknowledgements")
        .find({ taskTitle: req.body.title })
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        })
        .then((data) => {
            res.json(data);
        });
});

module.exports = app;