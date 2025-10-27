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

const music = document.getElementById('music'); // musique principale
const goodSound = new Audio('bonne.mp3');
const wrongSound = new Audio('mauvaise.mp3');
const victorySound = new Audio('victoire.mp3');

function showQuestion() {
    document.getElementById('question').textContent = questions[currentQuestion].question;
    const answers = document.getElementsByClassName('answer');
    for(let i = 0; i < answers.length; i++) {
        answers[i].textContent = questions[currentQuestion].answers[i];
        answers[i].disabled = false;
        answers[i].style.backgroundColor = '';
    }
    document.getElementById('result').textContent = '';
    // Relancer musique principale uniquement si ce n'est pas la dernière question
    if(currentQuestion < questions.length - 1) music.play();
}

function checkAnswer(index) {
    const answers = document.getElementsByClassName('answer');
    // Stop musique principale
    music.pause();
    music.currentTime = 0;

    if(index === questions[currentQuestion].correct) {
        answers[index].style.backgroundColor = 'green';
        document.getElementById('result').textContent = "Bonne réponse !";
        goodSound.play();

        setTimeout(() => {
            currentQuestion++;
            if(currentQuestion < questions.length) {
                showQuestion();
            } else {
                // Dernière question réussie
                document.getElementById('result').textContent = "🎉 Félicitations, jeu terminé !";
                document.getElementById('question-container').style.display = 'none';
                victorySound.play(); // musique de victoire
            }
        }, 2000);

    } else {
        answers[index].style.backgroundColor = 'red';
        answers[questions[currentQuestion].correct].style.backgroundColor = 'green';
        document.getElementById('result').textContent = "Mauvaise réponse... Réessayez !";
        wrongSound.play();

        // Relance de la même question après 2 secondes
        setTimeout(() => {
            showQuestion();
        }, 2000);
    }

    for(let btn of answers) btn.disabled = true;
}

// Démarrer le jeu et musique au clic sur "Lancer le jeu"
document.getElementById('startBtn').addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    music.play();
    showQuestion();
});
