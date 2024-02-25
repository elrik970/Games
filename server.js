const express = require("express");
const bodyParser = require("body-parser");
const env = require("dotenv").config();

app = express();

app.use(express.static('public'));
const jsonParser = bodyParser.json();

// const port = 3000;
const port = process.env.PORT || 3000;

const server = app.listen(port);

const Datastore = require("nedb");
const database = new Datastore("database.db");
database.loadDatabase();




app.get("/stats", (request, response) => {

    const gameType = request.query.name;

    console.log(gameType);

    // 
    

    database.findOne({ 'name' : gameType}, function(err, doc) {


        if (err) {
            console.log(err);
            return;
        }
        
        console.log(doc);

        response.json(doc);

    });
    
});

app.put("/stats", jsonParser, (request, response) => {

    const gameType = request.body["type"];

    console.log(gameType);

    // 
    

    database.findOne({ 'name': gameType}, function(err, doc) {


        if (err) {
            console.log(err);
            return;
        }
        
        console.log(doc);

        if (doc) {
            console.log("add 1 to " + gameType);

            const returnValue = doc;


            

            returnValue['clicks'] += 1;

            console.log(returnValue['clicks']);

            const id  = returnValue['_id'];

            database.update(
                {'_id': id}, 
                { $set: { 'clicks': returnValue['clicks']} },
                {},// this argument was missing
                function (err, numReplaced) {
                    console.log("replaced---->" + numReplaced);
                }
            );

            database.loadDatabase();

            response.json(returnValue);

        }
        else {
            const returnValue = {};

            returnValue['name'] = gameType;
            returnValue['clicks'] = 1;

            database.insert(returnValue);

            database.loadDatabase();

            response.json(returnValue)
        }
    });
});