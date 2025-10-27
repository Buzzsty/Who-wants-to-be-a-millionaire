// --- QUESTIONS (modifie si besoin) ---
const questions = [
    { question: "Quelle est la capitale de la France ?", answers: ["Paris", "Lyon", "Marseille", "Nice"], correct: 0 },
    { question: "Combien de continents y a-t-il ?", answers: ["5","6","7","8"], correct: 2 },
    { question: "Qui a peint la Joconde ?", answers: ["Michel-Ange","Léonard de Vinci","Raphaël","Van Gogh"], correct: 1 },
    { question: "Quelle planète est connue comme la planète rouge ?", answers: ["Terre","Mars","Jupiter","Vénus"], correct: 1 }
];

let currentQuestion = 0;
let audioCtx = null; // WebAudio context (créé au premier clic)
const music = document.getElementById('music');      // musique principale (HTML audio)
const finaleMusic = document.getElementById('finale'); // musique de la question finale (HTML audio)

// Sons ponctuels (fichiers présents dans le dossier)
const goodSound = new Audio('bonne.mp3');
const wrongSound = new Audio('mauvaise.mp3');
const victorySound = new Audio('victoire.mp3');

// Elements DOM (ils existent grâce au defer)
const startBtn = document.getElementById('startBtn');
const startScreen = document.getElementById('start-screen');
const gameDiv = document.getElementById('game');
const lights = document.getElementById('lights');
const victoryImage = document.getElementById('victory-image');

// sécurité : verifier éléments
if(!startBtn || !gameDiv || !startScreen) {
    console.error('Éléments essentiels introuvables dans le DOM.');
}

// --- UTIL ---
function sleep(ms){ return new Promise(res => setTimeout(res, ms)); }

// WebAudio beep
function playBeep(frequency = 440, duration = 0.12, when = 0, volume = 0.08) {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(frequency, now + when);
    g.gain.setValueAtTime(volume, now + when);
    g.gain.exponentialRampToValueAtTime(0.0001, now + when + duration);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(now + when);
    o.stop(now + when + duration + 0.02);
}

// sons progressifs (suspense)
async function playProgressiveTones(isFinal = false){
    if (!audioCtx) return;
    const baseFreq = isFinal ? 380 : 300;
    const steps = isFinal ? 7 : 5;
    let interval = isFinal ? 420 : 520;
    for(let i=0;i<steps;i++){
        const freq = baseFreq + i * (isFinal ? 80 : 60);
        playBeep(freq, 0.12, 0, 0.09 + i*0.01);
        await sleep(interval);
        interval = Math.max(140, Math.round(interval * 0.85));
    }
}

// pulse lights (ajoute et retire la classe)
function pulseLightsOnce(){
    if(!lights) return;
    lights.classList.add('pulse');
    setTimeout(()=> lights.classList.remove('pulse'), 700);
}

// Affiche la question (gère pause, suspense puis lecture)
async function showQuestion(){
    const qEl = document.getElementById('question');
    const answers = document.getElementsByClassName('answer');

    qEl.textContent = questions[currentQuestion].question;
    for(let i=0;i<answers.length;i++){
        answers[i].textContent = questions[currentQuestion].answers[i];
        answers[i].disabled = true;      // disabled pendant suspense
        answers[i].classList.remove('correct','wrong');
    }
    document.getElementById('result').textContent = '';

    // stop toutes les musiques avant suspense
    try { music.pause(); music.currentTime = 0; } catch(e){}
    try { finaleMusic.pause(); finaleMusic.currentTime = 0; } catch(e){}

    const isFinal = (currentQuestion === questions.length - 1);
    await playProgressiveTones(isFinal);

    // après suspense : lancer la musique adaptée
    try {
        if(isFinal){
            await finaleMusic.play();
        } else {
            await music.play();
        }
    } catch(err){
        // possible si le navigateur refuse play() — log pour debug
        console.warn('play() blocked ou erreur :', err);
    }

    pulseLightsOnce();

    // activer réponses
    for(let i=0;i<answers.length;i++) answers[i].disabled = false;
}

// Vérifier réponse
function checkAnswer(index){
    const answers = document.getElementsByClassName('answer');
    const correctIndex = questions[currentQuestion].correct;

    // stop musiques
    try { music.pause(); music.currentTime = 0; } catch(e){}
    try { finaleMusic.pause(); finaleMusic.currentTime = 0; } catch(e){}

    // désactiver boutons
    for(let i=0;i<answers.length;i++) answers[i].disabled = true;

    if(index === correctIndex){
        answers[index].classList.add('correct');
        document.getElementById('result').textContent = "Bonne réponse !";
        try { goodSound.play(); } catch(e){ console.warn('bonne.mp3 play failed', e); }

        setTimeout(() => {
            currentQuestion++;
            if(currentQuestion < questions.length){
                showQuestion();
            } else {
                handleVictory();
            }
        }, 1400);

    } else {
        answers[index].classList.add('wrong');
        answers[correctIndex].classList.add('correct');
        document.getElementById('result').textContent = "Mauvaise réponse... Réessayez !";
        try { wrongSound.play(); } catch(e){ console.warn('mauvaise.mp3 play failed', e); }

        // relancer même question après pause
        setTimeout(() => {
            showQuestion();
        }, 1500);
    }
}

// Victoire finale
function handleVictory(){
    document.getElementById('result').textContent = "🎉 Félicitations, jeu terminé !";

    // Afficher image et intensifier lumières (vérif element)
    if(victoryImage){
        victoryImage.style.display = 'block';         // display forced, CSS .show controls animation/opacity
        setTimeout(()=> victoryImage.classList.add('show'), 120);
    }
    if(lights) lights.classList.add('intense');

    try { victorySound.play(); } catch(e){ console.warn('victoire.mp3 play failed', e); }
}

// start button (resume audio context + init)
startBtn.addEventListener('click', async () => {
    // créer AudioContext au premier geste utilisateur
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        try { await audioCtx.resume(); } catch(e){ console.warn('resume audioCtx failed', e); }
    }

    // Attempt to prime HTML audio elements (some navigateurs exigent interaction)
    try { await music.play(); music.pause(); music.currentTime = 0; } catch(e){}
    try { await finaleMusic.play(); finaleMusic.pause(); finaleMusic.currentTime = 0; } catch(e){}

    startScreen.style.display = 'none';
    gameDiv.style.display = 'block';
    currentQuestion = 0;
    showQuestion();
});

// fermer l'écran victoire au clic (sécurisé)
if(victoryImage){
    victoryImage.addEventListener('click', () => {
        victoryImage.classList.remove('show');
        lights.classList.remove('intense');
        setTimeout(()=> victoryImage.style.display = 'none', 600);
    });
}
