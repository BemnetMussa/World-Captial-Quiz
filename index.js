import express from "express"
import bodyParser from "body-parser"
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "450613",
    port: 5432
});

db.connect();


let quiz = [
    {   country: "Ethiopia", capital: "Addis Ababa",
        country: "France", capital: "paris",
        country: "United Kingdom", capital: "London",
        country: "United State of America", capital: "New York"
    },
]

db.query("SELECT * FROM capitals", (err, res) => {
    if (err) {
        console.error("Error Executing query", err.stack);
    } else {
        quiz = res.rows;
    }
    db.end();
});

let totalCorrect = 0;

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));


let currentQuestion = {};

//home page
app.get("/", async (req, res) => {
    totalCorrect = 0;
    await nextQuestion();
    console.log(currentQuestion);
    res.render("index.ejs", { question: currentQuestion});
})


app.post("/submit", (req, res) => {
    let answer = req.body.answer.trim();
    let isCorrect = false;
    if (currentQuestion.capital.toLowerCase() == answer.toLowerCase()) {
        totalCorrect++;
        console.log(totalCorrect);
        isCorrect = true;
    }

    nextQuestion();
    res.render("index.ejs", {
        question: currentQuestion,
        wasCorrect: isCorrect,
        totalScore: totalCorrect,
    });
});

async function nextQuestion(){
    const randomCountry = quiz[Math.floor(Math.random() * quiz.length)]
    currentQuestion = randomCountry;
    console.log(currentQuestion)

}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})