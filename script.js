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
        answers: ["Terre", "Mars", "Jupiter", "Vénus"],
        correct: 1
    }
];

let currentQuestion = 0;

// 🎵 Déclaration des sons
const music = document.getElementById('music');          // musique normale
const finaleMusic = new Audio('finale.mp3');              // musique finale spéciale
const goodSound = new Audio('bonne.mp3');
const wrongSound = new Audio('mauvaise.mp3');
const victorySound = new Audio('victoire.mp3');

function showQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('question').textContent = q.question;

    const answers = document.getElementsByClassName('answer');
    for (let i = 0; i < answers.length; i++) {
        answers[i].textContent = q.answers[i];
        answers[i].disabled = false;
        answers[i].style.backgroundColor = '';
    }

    document.getElementById('result').textContent = '';

    // 🎶 Choisir la musique selon la question
    stopAllMusic();

    if (currentQuestion === questions.length - 1) {
        // dernière question → musique finale
        finaleMusic.currentTime = 0;
        finaleMusic.play();
    } else {
        // musique principale pour les autres questions
        music.currentTime = 0;
        music.play();
    }
}

function checkAnswer(index) {
    const answers = document.getElementsByClassName('answer');

    // 🔇 Stop toutes les musiques dès qu’une réponse est cliquée
    stopAllMusic();

    for (let btn of answers) btn.disabled = true;

    const isCorrect = index === questions[currentQuestion].correct;

    if (isCorrect) {
        answers[index].style.backgroundColor = 'green';
        document.getElementById('result').textContent = "Bonne réponse !";
        goodSound.play();

        setTimeout(() => {
            currentQuestion++;

            if (currentQuestion < questions.length) {
                showQuestion();
            } else {
                // 🎉 Fin du jeu
                document.getElementById('result').textContent = "🎉 Félicitations, vous avez gagné !";
                document.getElementById('question-container').style.display = 'none';
                victorySound.play();
            }
        }, 2000);

    } else {
        answers[index].style.backgroundColor = 'red';
        answers[questions[currentQuestion].correct].style.backgroundColor = 'green';
        document.getElementById('result').textContent = "Mauvaise réponse...";

        wrongSound.play();

        // ⏳ Après 3 secondes, relancer la même question
        setTimeout(() => {
            if (currentQuestion === questions.length - 1) {
                // Rejouer musique finale pour la dernière question
                finaleMusic.play();
            } else {
                music.play();
            }
            showQuestion();
        }, 3000);
    }
}

// 🧠 Fonction utilitaire : stop toutes les musiques avant d’en rejouer une
function stopAllMusic() {
    [music, finaleMusic, goodSound, wrongSound, victorySound].forEach(m => {
        m.pause();
        m.currentTime = 0;
    });
}

// ▶️ Démarrage du jeu
document.getElementById('startBtn').addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    showQuestion();
});
