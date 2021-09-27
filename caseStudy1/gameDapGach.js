var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var scoreshow = document.getElementById('score');

var ball = {
    x: 400,
    y: 530,
    dx: 3,
    dy: -3,
    radius: 10,
};

var paddle = {
    width: 70,
    height: 10,
    x: canvas.width/2 -35, 
    y: canvas.height -10,
    speed: 5,
    isMovingLeft: false, 
    isMovingRight: false,
};

var bricks = {
    x: 30,
    y: 30,
    space: 30,
    width: 80,
    height: 20,
    totalRow: 4,
    totalCol: 7,
};

var isGameOver = false;
var isGameWin = false;
var coutscore = 0;
var maxscore = bricks.totalRow*bricks.totalCol;

var brickList = [];
for (var i = 0; i < bricks.totalRow; i++) {
    for (var j = 0; j < bricks.totalCol; j++) {
        brickList.push ({
            x: bricks.x + j*(bricks.width + bricks.space),
            y: bricks.y + i*(bricks.height + bricks.space),
            isBroken: false,
        });
    }
};

document.addEventListener('keyup', function (event) {
    if (event.keyCode == 37) {
        paddle.isMovingLeft = false;
    } else if (event.keyCode == 39) {
       paddle.isMovingRight = false; 
    }
});

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 37) {
        paddle.isMovingLeft = true;
    } else if (event.keyCode == 39) {
       paddle.isMovingRight = true; 
    }
});

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2*Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
};

function drawPaddle () {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
};

function drawBricks() {
    brickList.forEach(function callback(b) {
        if (!b.isBroken) {
            ctx.beginPath();
            ctx.rect(b.x, b.y, bricks.width, bricks.height);
            ctx.fillStyle = '#327297';
            ctx.fill();
            ctx.closePath();
        }
    });
};

// function drawBricks() {
//     for (var i = 0; i < 4; i++) {
//         for (var j = 0; j < 7; j++) {
//             ctx.beginPath();
//             ctx.rect(
//                 30 + j * (80 + 30),
//                 30 + i * (20 + 30),
//                 80,
//                 20
//             );
//             ctx.fillStyle = '#327297';
//             ctx.fill();
//             ctx.closePath();
//         }
//     }
// }

function movingBall() {
    ball.x += ball.dx; ball.y += ball.dy;
};

function movingPaddle() {
    if (paddle.isMovingLeft) {
        paddle.x -= paddle.speed;
    } else if (paddle.isMovingRight) {
        paddle.x += paddle.speed;
    }
    if (paddle.x < 0) {
        paddle.x = 0;
    } else if (paddle.x > canvas.width - paddle.width) {
        paddle.x = canvas.width - paddle.width;
    }   
};

function ballColideHall() {
    if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y < ball.radius) {
        ball.dy = -ball.dy;
    } 
};

function ballColideBricks() {
    brickList.forEach(function callback(b) {
        if (!b.isBroken) {
            if (ball.x <= b.x + bricks.width && ball.x >= b.x && 
                    ball.y - ball.radius <= b.y + bricks.height &&
                    ball.y + ball.radius >= b.y) {
                ball.dy = -ball.dy;
                b.isBroken = true;
                coutscore +=1;
                document.getElementById('score').innerHTML = 'score: ' + coutscore;
            }
            if (ball.y <= b.y + bricks.height && ball.y >= b.y && 
                    ball.x + ball.radius >= b.x && ball.x - ball.radius <= b.x + bricks.width) {
                ball.dx = -ball.dx;
                b.isBroken = true;
                coutscore +=1;
                document.getElementById('score').innerHTML = 'score: ' + coutscore;
            }
            if (coutscore >= maxscore) {
                isGameWin = true;
                isGameOver = true;
            }
        }
    });
}

function ballColidePaddle() {
    if (ball.x >= paddle.x && ball.x <= paddle.x + paddle.width && 
        ball.y + ball.radius >= canvas.height - paddle.height) {
        ball.dy = -ball.dy;
    }
};

function draw() {
    if (!isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        drawBricks();
        movingBall();
        movingPaddle();
        ballColideHall();
        ballColidePaddle();
        ballColideBricks();

        if (ball.y > canvas.height - ball.radius) {
            isGameOver = true;
        }
  
        requestAnimationFrame(draw);
    } else {
        if (isGameWin) {
            alert('YOU WIN');
        } else {
            alert('GAME OVER');
        }
    }
        

};

draw();