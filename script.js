const questions=[
{question:"Quelle est la capitale de la France ?",answers:["Paris","Lyon","Marseille","Nice"],correct:0},
{question:"Combien de continents y a-t-il ?",answers:["5","6","7","8"],correct:2},
{question:"Qui a peint la Joconde ?",answers:["Michel-Ange","Léonard de Vinci","Raphaël","Van Gogh"],correct:1},
{question:"Quelle planète est connue comme la planète rouge ?",answers:["Terre","Mars","Jupiter","Vénus"],correct:1}
];

let currentQuestion=0;

// Audio
const music=document.getElementById('music');
const finaleMusic=document.getElementById('finale');
const goodSound=document.getElementById('good');
const wrongSound=document.getElementById('wrong');
const victorySound=document.getElementById('victory');

// Victory screen
const victoryScreen=document.getElementById('victory-screen');
const victoryImage=document.getElementById('victory-image');

function stopAllMusic(){
[music,finaleMusic,goodSound,wrongSound,victorySound].forEach(m=>{m.pause();m.currentTime=0;});
}

function showQuestion(){
const q=questions[currentQuestion];
document.getElementById('question').textContent=q.question;
const answers=document.getElementsByClassName('answer');
for(let i=0;i<answers.length;i++){
answers[i].textContent=q.answers[i];
answers[i].disabled=false;
answers[i].style.backgroundColor='';
}
document.getElementById('result').textContent='';
document.getElementById('question-container').classList.remove('final-question');

stopAllMusic();
if(currentQuestion===questions.length-1){
document.getElementById('question-container').classList.add('final-question');
finaleMusic.currentTime=0;
finaleMusic.play().catch(err=>console.warn('Erreur musique finale',err));
}else{
music.currentTime=0;
music.play().catch(err=>console.warn('Erreur musique principale',err));
}
}

function checkAnswer(index){
const answers=document.getElementsByClassName('answer');
stopAllMusic();
for(let btn of answers) btn.disabled=true;
const isCorrect=index===questions[currentQuestion].correct;

if(isCorrect){
answers[index].style.backgroundColor='green';
document.getElementById('result').textContent="Bonne réponse !";
goodSound.play();
setTimeout(()=>{
currentQuestion++;
if(currentQuestion<questions.length){
showQuestion();
}else{
document.getElementById('question-container').style.display='none';
showVictory();
}
},2000);
}else{
answers[index].style.backgroundColor='red';
answers[questions[currentQuestion].correct].style.backgroundColor='green';
document.getElementById('result').textContent="Mauvaise réponse...";
wrongSound.play();
setTimeout(()=>{
if(currentQuestion===questions.length-1){ finaleMusic.play(); }else{ music.play(); }
showQuestion();
},3000);
}
}

function showVictory(){
    victoryScreen.style.display='flex';
    victoryImage.style.width='0';
    victoryImage.style.opacity=0;
    setTimeout(()=>{
        victoryImage.style.opacity=1;
        victoryImage.style.width='30%';   // zoom progressif largeur seulement
    },50);
    victorySound.play();
}

document.getElementById('startBtn').addEventListener('click',()=>{
document.getElementById('start-screen').style.display='none';
document.getElementById('game').style.display='block';
showQuestion();
});
