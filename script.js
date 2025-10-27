const questions = [
    {
        question: "Quelle est la capitale de la France ?",
        answers: ["Paris", "Lyon", "Marseille", "Nice"],
        correct: 0
    },
    {
        question: "Combien de continents y a-t-il ?",
        answers: ["5", "6", "7", "8"],
        correct: 2
    },
    {
        question: "Qui a peint la Joconde ?",
        answers: ["Michel-Ange", "Léonard de Vinci", "Raphaël", "Van Gogh"],
        correct: 1
    },
    {
        question: "Quelle planète est connue comme la planète rouge ?",
        answers: ["Terre", "Mars", "Jupiter", "Venus"],
        correct: 1
    }
];

let currentQuestion = 0;

function showQuestion() {
    document.getElementById('question').textContent = questions[currentQuestion].question;
    const answers = document.getElementsByClassName('answer');
    for(let i = 0; i < answers.length; i++) {
        answers[i].textContent = questions[currentQuestion].answers[i];
        answers[i].disabled = false;
        answers[i].style.backgroundColor = '';
    }
    document.getElementById('result').textContent = '';
}

function checkAnswer(index) {
    const answers = document.getElementsByClassName('answer');
    if(index === questions[currentQuestion].correct) {
        answers[index].style.backgroundColor = 'green';
        document.getElementById('result').textContent = "Bonne réponse !";
    } else {
        answers[index].style.backgroundColor = 'red';
        answers[questions[currentQuestion].correct].style.backgroundColor = 'green';
        document.getElementById('result').textContent = "Mauvaise réponse...";
    }
    for(let btn of answers) btn.disabled = true;

    // Passe à la question suivante après 2 secondes
    setTimeout(() => {
        currentQuestion++;
        if(currentQuestion < questions.length) {
            showQuestion();
        } else {
            document.getElementById('result').textContent = "Jeu terminé !";
            document.getElementById('question-container').style.display = 'none';
        }
    }, 2000);
}

showQuestion();
