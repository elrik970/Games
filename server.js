
// const database = require(database.js);

const express = require("express");
const bodyParser = require("body-parser");
const env = require("dotenv").config();

app = express();

app.use(express.static('public'));
const jsonParser = bodyParser.json();

// const port = 3000;
const port = process.env.PORT || 3000;

const server = app.listen(port);

// const Datastore = require("nedb");
// const database = new Datastore("database.db");
// database.loadDatabase();

const database = require("./database.js");

console.log(database);


app.get("/stats", async (request, response) => {

    const gameType = request.query.name;

    response.json((await database.get(gameType)));
    
});

app.put("/stats", jsonParser, async (request, response) => {

    const gameType = request.body["type"];

    console.log(gameType);

    response.json(await database.update(gameType,'views',1));
    


    
});