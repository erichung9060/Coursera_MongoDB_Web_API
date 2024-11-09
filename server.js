const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const DB_URL = process.env.DB_URL;
const API_PASSWORD = process.env.API_PASSWORD

const client = new MongoClient(DB_URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}

function shutdownDB() {
    console.log('Shutting down server...');
    client.close()
        .then(() => {
            console.log('MongoDB connection closed.');
            process.exit(0);
        })
        .catch((err) => {
            console.error('Error closing MongoDB connection:', err);
            process.exit(1);
        });
}

connectToDB();
const database = client.db('coursera');

process.on('SIGINT', shutdownDB);
process.on('SIGTERM', shutdownDB);


const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


app.post('/insert', async (req, res) => {
    try {
        res.set('Access-Control-Allow-Origin', '*');
        const { question, answer, password, url } = req.body;
        if(password != API_PASSWORD) return res.status(401).json({ error: "Invalid password" });

        if (question == null || question == "" || answer == null || answer == "" || url == null || url == "") {
            return res.status(400).json({ error: "Question and answer are required" });
        }

        console.log("Insert Question : ")
        console.log(question)
        console.log(answer)

        const questionDB = database.collection(url);

        const existingQuestion = await questionDB.findOne({ question });

        if (existingQuestion) {
            return res.status(200).json({ error: "Question already exists" });
        }
        
        const result = await questionDB.insertOne({ question, answer });
        res.status(200).json({ message: "Data inserted successfully", insertedId: result.insertedId });
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: "Failed to insert data" });
    }
});

app.post('/query', async (req, res) => {
    try {
        res.set('Access-Control-Allow-Origin', '*');
        const { question, password, url } = req.body;
        if(password != API_PASSWORD) return res.status(401).json({ error: "Invalid password" });
        
        if (question == null || question == "" || url == null || url == "") {
            return res.status(400).json({ error: "Question and answer are required" });
        }

        const questionDB = database.collection(url);
        const result = await questionDB.findOne({ question });

        console.log("Get query : ")
        console.log(question)
        console.log(result)

        if (!result) {
            res.json({ question: question});
        }else{
            res.json({ question: question, answer: result.answer });
        }

    } catch (error) {
        console.error("Error querying data:", error);
        res.status(500).json({ error: "Failed to query data" });
    }
});