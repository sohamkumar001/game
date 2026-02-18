// SOUND EFFECTS
const jumpSound = new Audio("sounds/jump.mp3");
const scoreSound = new Audio("sounds/score.mp3");
const hitSound = new Audio("sounds/hit.mp3");

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let W = 400;
let H = 600;
canvas.width = W;
canvas.height = H;

const GRAVITY = 0.25;
const JUMP = -5.5;
const PIPE_GAP = 150;
const PIPE_SPEED = 3;

let bird, pipes, score, running;

class Bird {
    constructor(){
        this.x = 80;
        this.y = H/2;
        this.v = 0;
        this.r = 15;

        jump(){
    this.v = JUMP;
    jumpSound.currentTime = 0;
    jumpSound.play();
}

    }

    update(){
        this.v += GRAVITY;
        this.y += this.v;

        if(this.y > H || this.y < 0) endGame();
    }

    draw(){
        ctx.fillStyle="yellow";
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fill();
    }

    jump(){
        this.v = JUMP;
    }
}

class Pipe {
    constructor(){
        this.x = W;
        this.w = 60;
        this.top = Math.random()*(H-PIPE_GAP-100)+50;
        this.passed=false;
        
if(!this.passed && this.x < bird.x){
    score++;
    document.getElementById("score").innerText=score;

    scoreSound.currentTime = 0;
    scoreSound.play();

    this.passed=true;
}

    }

    update(){
        this.x -= PIPE_SPEED;

        if(
            bird.x + bird.r > this.x &&
            bird.x - bird.r < this.x + this.w
        ){
            if(
                bird.y - bird.r < this.top ||
                bird.y + bird.r > this.top + PIPE_GAP
            ){
                endGame();
            }
        }

        if(!this.passed && this.x < bird.x){
            score++;
            document.getElementById("score").innerText=score;
            this.passed=true;
        }
    }

    draw(){
        ctx.fillStyle="green";
        ctx.fillRect(this.x,0,this.w,this.top);
        ctx.fillRect(this.x,this.top+PIPE_GAP,this.w,H);
    }
}

function startGame(){
    bird = new Bird();
    pipes = [];
    score = 0;
    running = true;

    document.getElementById("score").innerText="0";
    document.getElementById("gameOver").style.display="none";

    loop();
}

function endGame(){
    running = false;
    document.getElementById("finalScore").innerText=score;
    document.getElementById("gameOver").style.display="block";

    function endGame(){
    running = false;

    hitSound.currentTime = 0;
    hitSound.play();

    document.getElementById("finalScore").innerText=score;
    document.getElementById("gameOver").style.display="block";
}

}

let lastPipe = 0;

function loop(){
    if(!running) return;

    ctx.clearRect(0,0,W,H);

    let g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,"#4ec0ca");
    g.addColorStop(1,"#dff6f5");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);

    if(lastPipe++ > 90){
        pipes.push(new Pipe());
        lastPipe = 0;
    }

    pipes.forEach(p=>{
        p.update();
        p.draw();
    });

    bird.update();
    bird.draw();

    requestAnimationFrame(loop);
}

window.addEventListener("keydown", e=>{
    if(e.code==="Space"||e.code==="ArrowUp") bird.jump();
});

canvas.addEventListener("mousedown", ()=>bird.jump());
canvas.addEventListener("touchstart", (e)=>{
    e.preventDefault();
    bird.jump();
});

startGame();


