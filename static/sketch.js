class object {
    constructor(speed) {
        // Declair position (X, Y), speed direction (vecX, vecY) and speed
        this.X = Math.random() * screen.width;
        this.Y = Math.random() * screen.height;
        this.theta = Math.random() * 2 * Math.PI;
        this.vecX = Math.cos(this.theta);
        this.vecY = Math.sin(this.theta);
        this.speed = speed;
    }
    // Determine movement direction
    vec(chaseX, chaseY) {
        let x = chaseX - this.X;
        let y = chaseY - this.Y;
        let length = Math.sqrt(x**2 + y**2);
        this.vecX = x / length;
        this.vecY = y / length;
    }
    // Update the position
    posit() {
        this.X += this.speed * this.vecX;
        this.Y += this.speed * this.vecY;
    }
}
class broccoli extends object {
    constructor(speed, time) {
        super(speed);
        // Determine at what time during the 1-second period the broccoli will change direction
        this.t = time;
    }
}

class Worm extends object {
    constructor(speed) {
        super(speed);
    }
    motion(left, right, up, down) {

        if (!up && down && left && right)
        {
            this.theta = Math.PI * 3 / 2;
            this.vecX = Math.cos(this.theta);
            this.vecY = Math.sin(this.theta);
        }
        else if (up && !down && left && right)
        {
            this.theta = Math.PI * 1 / 2;
            this.vecX = Math.cos(this.theta);
            this.vecY = Math.sin(this.theta);
        }
        else if (up && down && !left && right)
        {
            this.theta = Math.PI * 0;
            this.vecX = Math.cos(this.theta);
            this.vecY = Math.sin(this.theta);
        }
        else if (up && down && left && !right)
        {
            this.theta = Math.PI * 1;
            this.vecX = Math.cos(this.theta);
            this.vecY = Math.sin(this.theta);
        }
        else if (up && !down && left && !right)
        {
            this.theta = Math.PI * 3 / 4;
            this.vecX = Math.cos(this.theta);
            this.vecY = Math.sin(this.theta);
        }
        else if (up && !down && !left && right)
        {
            this.theta = Math.PI * 1 / 4;
            this.vecX = Math.cos(this.theta);
            this.vecY = Math.sin(this.theta);
        }
        else if (!up && down && left && !right)
        {
            this.theta = Math.PI * 5 / 4;
            this.vecX = Math.cos(this.theta);
            this.vecY = Math.sin(this.theta);
        }
        else if (!up && down && !left && right)
        {
            this.theta = Math.PI * 7 / 4;
            this.vecX = Math.cos(this.theta);
            this.vecY = Math.sin(this.theta);
        }
        else if (up && !down && !left && !right)
        {
            this.theta = Math.PI * 1 / 2;
            this.vecX = Math.cos(this.theta);
            this.vecY = Math.sin(this.theta);
        }
        else if (!up && down && !left && !right)
        {
            this.theta = Math.PI * 3 / 2;
            this.vecX = Math.cos(this.theta);
            this.vecY = Math.sin(this.theta);
        }
        else if (!up && !down && left && !right)
        {
            this.theta = Math.PI * 1;
            this.vecX = Math.cos(this.theta);
            this.vecY = Math.sin(this.theta);
        }
        else if (!up && !down && !left && right)
        {
            this.theta = Math.PI * 0;
            this.vecX = Math.cos(this.theta);
            this.vecY = Math.sin(this.theta);
        }
        else
        {
            this.vecX = 0;
            this.vecY = 0;
        }
        this.posit();
    }
}

let points = 0;

let worm = new Worm(10);
let isMovingLeft, isMovingRight, isMovingUp, isMovingDown;

let shark = new object(20);
let clownfish = new object(7);
let pufferfish = new object(10);
let worm_size = 30;
let shark_size = 100;
let clownfish_size = 50;
let pufferfish_size = 70;
let t_r = 0;


let b1 = new broccoli(8, 0);
let b2 = new broccoli(8, 100);
let b3 = new broccoli(8, 250);
let b4 = new broccoli(8, 630);
let b5 = new broccoli(8, 840);
let broccoli_size = 15;
let startTime, endTime;
let start = false;

function setup() {
    let point = createDiv();
    point.id("points");
    point.position(10,10);
    document.getElementById('points').classList.add("textColor");
    point.show();

    startTime = new Date();
    
    let canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.parent('canvasContainer');
    canvas.show();
    
    let startdiv = document.createElement("div");
    startdiv.id = "startdiv";
    startdiv.classList.add("p-3", "position-absolute", "top-50", "start-50", "translate-middle", "d-flex", "flex-column", "justify-content-center", "align-items-center", "text-center");
    document.getElementsByTagName("main")[0].appendChild(startdiv)

    // Game instructions
    startdiv.innerHTML = `
    <div class="p-3 gamediv display-6 textColor mb-5">
        <div class="mb-3">You are the <span class="textGlowColor"> Light Yellow </span> one </div>
        <div class="mb-3">Use WASD to control yourself</div>
        <div class="mb-3">Eat those with <span class="textGlowColor"> Light Yellow </span> stroke</div>
    </div>
    `
    let start_button = document.createElement("button");
    start_button.id = "start_button";
    start_button.classList.add("btn", "buttonColor");
    start_button.innerHTML = `Click to Start`
    startdiv.appendChild(start_button);

    worm.X = width / 2;
    worm.Y = height / 2;
}

function draw() {
    resizeCanvas(window.innerWidth, window.innerHeight);
    background(5, 20, 34);
    if (!start) {
        document.getElementById("start_button").addEventListener("click", function(){
            start = true;
        })
    }
    else
    {
        document.getElementById("startdiv").classList.add("d-none");

        // By cursor
        // worm_motion();
        worm.motion(isMovingLeft, isMovingRight, isMovingDown, isMovingUp);
        fill(252, 240, 151);
        circle(worm.X, worm.Y, worm_size);
    
        clownfish_motion();
        shark_motion();
        pufferfish_motion();
    
        broccoli_motion(b1);
        broccoli_motion(b2);
        broccoli_motion(b3);
        broccoli_motion(b4);
        broccoli_motion(b5);
    
        
        document.getElementById('points').innerHTML = `${points} points`;
        
        // End game condition
        if (points >= 3 || is_touched()) {
            over();w
            noLoop();
        }
        
    }

}





function over() {
    endTime = new Date();
    const timeDiff = endTime - startTime;
    const seconds = timeDiff / 1000;
    const div = document.createElement("div");
    div.classList.add("position-absolute", "top-50", "start-50", "translate-middle");
    document.getElementsByTagName("main")[0].appendChild(div)

    const scorediv = document.createElement("div");
    scorediv.classList.add("d-flex", "flex-column", "justify-content-center", "align-items-center", "text-center", "textColor");
    div.appendChild(scorediv)

    // If player wins
    if (points >= 3) {
        scorediv.innerHTML = `
        <div class="py-5 col-12 container text-center">
            <h1 class="gameEndtext mb-3">YOU WIN</h1>
            <h2 class="gameEndtext mb-5">Time played: ${seconds} seconds</h2>
            <form action="/game" method="post">
                <div class="mb-3">
                    <input type="hidden" class="form-control" value="${seconds}" name="played_time">
                </div>
                <div class="mb-3">
                    <input type="text" class="inputColor form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" name="comment" placeholder="Add a Comment" autocomplete="off" maxlength="30">
                </div>
                <button type="submit" class="gameEndbutton btn buttonColor mb-3">Home</button>
            </form>
        </div>
        `
    }
    // If player looses
    else {
        scorediv.innerHTML = `
        <div class="py-5 col-12 container text-center">
            <h1 class="gameEndtext mb-3">YOU LOSE</h1>
            <h2 class="gameEndtext mb-5">Time played: ${seconds} seconds</h2>
            <a class="gameEndbutton mx-5 mb-3 btn buttonColor" href="/game" role="button">Play again</a>
            <a class="gameEndbutton mx-5 mb-3 btn buttonColor" href="/" role="button">Home</a>
        </div>
        `
    }

    
}

// Check if player is catched by others
function is_touched() {
    if (
        Math.sqrt((worm.X - shark.X)**2 + (worm.Y - shark.Y)**2) <= (worm_size + shark_size) / 2 ||
        Math.sqrt((worm.X - clownfish.X)**2 + (worm.Y - clownfish.Y)**2) <= (worm_size + clownfish_size) / 2 ||
        Math.sqrt((worm.X - pufferfish.X)**2 + (worm.Y - pufferfish.Y)**2) <= (worm_size + pufferfish_size) / 2
    )
    {
        return true;
    }
    return false;
}

// function worm_motion() {
//     worm.vec(mouseX, mouseY);
//     worm.posit();
//     noStroke();
//     fill('pink');
//     circle(worm.X, worm.Y, worm_size);
// }


function clownfish_motion() {
    clownfish.vec(worm.X, worm.Y);
    clownfish.posit();
    fill(255, 255, 255);
    circle(clownfish.X, clownfish.Y, clownfish_size);
}

function shark_motion() {
    if (shark.X <= 0 || shark.X >= width || shark.Y <= 0 || shark.Y >= height) {
        shark.vec(worm.X, worm.Y);
    }
    shark.posit();
    fill('white')
    circle(shark.X, shark.Y, shark_size);
    strokeWeight(2);
    
}

function pufferfish_motion() {
    let t = new Date;
    if (Math.sqrt((pufferfish.X - worm.X)**2 + (pufferfish.Y - worm.Y)**2) <= 150) {
        pufferfish.speed = 8;
        pufferfish.vec(worm.X, worm.Y);
        pufferfish.posit();
        t_r = t.getSeconds();
    }
    else {
        pufferfish.speed = 6;

        if (abs(t.getSeconds() - t_r) > 1) {
            t_r = t.getSeconds();
            pufferfish.vec(Math.random() * width, Math.random() * height);
        }
        pufferfish.posit();
    }
    fill('white')
    circle(pufferfish.X, pufferfish.Y, pufferfish_size);
}

function broccoli_motion(b) {
    let t = new Date;

    if (t.getMilliseconds() >= b.t && t.getMilliseconds() <= b.t + 50) {
        b.vec(Math.random() * width, Math.random() * height);
    }
    
    b.posit();
    
    if (Math.sqrt((worm.X - b.X)**2 + (worm.Y - b.Y)**2) <= (worm_size + broccoli_size) / 2) {
        b.X = Math.random() * width;
        b.Y = Math.random() * height;
        points++;
    }
    stroke(252, 240, 151)
    noFill();
    square(b.X, b.Y, broccoli_size, 5);
    noStroke();

}

function keyPressed() {
    if (key === 'w') {
      isMovingUp = true;
    }
    if (key === 's') {
      isMovingDown = true;
    }
    if (key === 'a') {
      isMovingLeft = true;
    }
    if (key === 'd') {
      isMovingRight = true;
    }
}
  
  function keyReleased() {
    if (key === 'w') {
      isMovingUp = false;
    }
    if (key === 's') {
      isMovingDown = false;
    }
    if (key === 'a') {
      isMovingLeft = false;
    }
    if (key === 'd') {
      isMovingRight = false;
    }
}