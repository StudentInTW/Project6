const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let Xspeed = 20;
let Yspeed = 20;
let ground_x = 100;
let ground_y = 500;
let ground_height = 5;
let brickArray = [];
let count = 0;

function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}
//Make brick
class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true;
  }

  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + radius + this.width &&
      ballY >= this.y - radius &&
      ballY <= this.y + radius + this.height
    );
  }
}
//make all the bricks
for (let i = 0; i < 10; i++) {
  new Brick(getRandomArbitrary(0, 950), getRandomArbitrary(0, 550));
}

c.addEventListener("mousemove", (e) => {
  ground_x = e.clientX;
});

function drawCircle() {
  //Check if the ball touches bricks
  brickArray.forEach((brick, index) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      //Change speed along X,Y axis,and remove brick being touched.
      if (circle_x <= brick.x || circle_x >= brick.x + brick.width) {
        Xspeed *= -1;
      } else if (circle_y <= brick.y || circle_y >= brick.y + brick.height) {
        Yspeed *= -1;
      }
      brick.visible = false;
      // brickArray.splice(index, 1); //時間複雜度 O(n) 太耗能
      if (count == 10) {
        alert("Game over!!!");
        clearInterval(game);
      }
    }
  });

  //If the ball hits the orange board
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + radius + 200 &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius + 5
  ) {
    if (Yspeed > 0) {
      circle_y -= 40;
    } else {
      circle_y += 40;
    }
    Yspeed *= -1;
  }

  //Change the ball's coordinate
  circle_x += Xspeed;
  circle_y += Yspeed;

  //碰到右邊或左邊X方向乘以-1!
  if (circle_x >= canvasWidth - radius) {
    Xspeed *= -1;
  } else if (circle_x <= radius) {
    Xspeed *= -1;
  }
  //碰到下面或上面則Y方向乘以-1!
  if (circle_y >= canvasHeight - radius) {
    Yspeed *= -1;
  } else if (circle_y <= radius) {
    Yspeed *= -1;
  }

  //Redraw background when calling function
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  //Build all the bricks
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  //controllable Board
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, 200, ground_height);

  //Draw a ball
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}
let game = setInterval(drawCircle, 25);
