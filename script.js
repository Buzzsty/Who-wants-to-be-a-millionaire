// QUESTIONS - personnalise si besoin
const questions = [
    { question: "Quelle est la capitale de la France ?", answers: ["Paris", "Lyon", "Marseille", "Nice"], correct: 0 },
    { question: "Combien de continents y a-t-il ?", answers: ["5","6","7","8"], correct: 2 },
    { question: "Qui a peint la Joconde ?", answers: ["Michel-Ange","Léonard de Vinci","Raphaël","Van Gogh"], correct: 1 },
    { question: "Quelle planète est connue comme la planète rouge ?", answers: ["Terre","Mars","Jupiter","Vénus"], correct: 1 }
];

let currentQuestion = 0;
let audioCtx = null; // WebAudio context pour sons progressifs
const music = document.getElementById('music');      // musique principale
const finaleMusic = document.getElementById('finale'); // musique de la question finale

// Sons ponctuels (fichiers présents)
const goodSound = new Audio('bonne.mp3');
const wrongSound = new Audio('mauvaise.mp3');
const victorySound = new Audio('victoire.mp3');

const startBtn = document.getElementById('startBtn');
const startScreen = document.getElementById('start-screen');
const gameDiv = document.getElementById('game');
const lights = document.getElementById('lights');

startBtn.addEventListener('click', async () => {
    // Créer et démarrer le AudioContext (permet les tons progressifs)
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume must be triggered by user gesture
    if (audioCtx.state === 'suspended') await audioCtx.resume();

    // Ensure HTML audio is allowed (user gesture)
    try { await music.play(); music.pause(); music.currentTime = 0; } catch(e){ /* ignore */ }
    try { await finaleMusic.play(); finaleMusic.pause(); finaleMusic.currentTime = 0; } catch(e){ /* ignore */ }

    startScreen.style.display = 'none';
    gameDiv.style.display = 'block';

    currentQuestion = 0;
    showQuestion(); // gère sons progressifs puis démarre la musique adaptée
});

// Fonction utilitaire sleep
function sleep(ms){ return new Promise(res => setTimeout(res, ms)); }

// Jouer un seul beep avec WebAudio
function playBeep(frequency = 440, duration = 0.12, when = 0, volume = 0.08) {
    if (!audioCtx) return;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(frequency, audioCtx.currentTime + when);
    g.gain.setValueAtTime(volume, audioCtx.currentTime + when);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + when + duration);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(audioCtx.currentTime + when);
    o.stop(audioCtx.currentTime + when + duration + 0.02);
}

// Sons progressifs type "suspense" avant chaque question
// pattern: suite de beeps avec fréquences et intervalles changeants
async function playProgressiveTones(isFinal = false){
    if (!audioCtx) return;
    // Sequence pattern (on accélère et la fréquence monte)
    const baseFreq = isFinal ? 380 : 300;
    const steps = isFinal ? 7 : 5;
    let interval = isFinal ? 420 : 520; // ms between beeps (will decrease)
    for(let i=0;i<steps;i++){
        const freq = baseFreq + i * (isFinal ? 80 : 60);
        playBeep(freq, 0.12, 0, 0.09 + i*0.01);
        await sleep(interval);
        // accélère progressivement
        interval = Math.max(140, Math.round(interval * 0.85));
    }
}

// Affiche la question (async car utilise les sons progressifs)
asy
