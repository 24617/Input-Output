let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let scalingFactor = 2;
ctx.canvas.width = constraints.video.width * scalingFactor;
ctx.canvas.height = constraints.video.height * scalingFactor;
let verticalArea = constraints.video.height;

// Make new tracker.
let tracker = new tracking.ColorTracker();
tracking.track('#video', tracker);

// Make variables for middle of rect.
let rectX = 0;
let rectY = 0;

// Setup ball.
let lerpSpeed = 0.2;
let lerpPosX = 0;
let lerpPosY = 0;

// Mirror the canvas.
ctx.translate(constraints.video.width * scalingFactor, 0);
ctx.scale(-scalingFactor, scalingFactor);

// Setup player.
let player = {};
let i = new Vector2d(1, 1);
player.top = 50;
player.pos = new Vector2d(0, 0);
player.point = new Point(0, 0, 50, "red");
player.vel = new Vector2d(0, 0);

// Setup enemy.
let enemy = {};
let enemySpeed = 1.5;
let j = new Vector2d(1, 1);
enemy.pos = new Vector2d(300, 50);
enemy.point = new Point(0, 0, 20, "blue");
enemy.vel = new Vector2d(-enemySpeed, enemySpeed); // Speed.
enemy.acc = new Vector2d(0, 0.1); // Acceleration.

// Setup scoreboard.
let score = 0;
let scoreX = 10;
let scoreY = 40;

tracker.on('track', function(event) {
 ctx.clearRect(0, 0, canvas.width, canvas.height);

 event.data.forEach(function(rect) {
   if (rect.color === 'custom') {
     rect.color = tracker.customColor;
   }
   ctx.strokeStyle = rect.color;
   ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
   ctx.fillStyle = "#fff";

   // Assign rect coordinates.
   rectX = rect.x + rect.width/2;
   rectY = rect.y + rect.height/2;
 });

  // Create lerp.
  lerpPosX = lerp(player.pos.dx, rectX, lerpSpeed);
  lerpPosY = lerp(player.pos.dy, rectY, lerpSpeed);

  // Calculate distance.
  j.dx = enemy.point.x - player.point.x;
  j.dy = enemy.point.y - player.point.y;

  // Calculate vectors.
  i.dx = -j.dy;
  i.dy = j.dx;
  i.r = 1;
  j.r = 1;

  i.r = player.vel.dot(i);
  j.r = player.vel.dot(j);

  // Wall collision
  if (enemy.pos.dx < enemy.point.r || enemy.pos.dx > canvas.width / scalingFactor - enemy.point.r){
    enemy.vel.dx *= -1;
    console.log("dx collide");
  }
  if (enemy.pos.dy < enemy.point.r){
    enemy.vel.dy *= -1;
    console.log("dy collide");
  }

  // Ball collision.
  if (enemy.point.distanceToAnOtherPoint(player.point)  < enemy.point.r + player.point.r){
    enemy.vel.dy *= -1;
    // Add score.
    score++;
    console.log("balls collided");
  }

  // Draw ball.
  player.pos.dx += lerpPosX;
  player.pos.dy = verticalArea;
  player.point.position(player.pos);
  //player.point.draw(ctx);

  // Draw enemy.
  enemy.vel.add(enemy.acc);
  enemy.pos.add(enemy.vel);
  enemy.point.position(enemy.pos);
  enemy.point.draw(ctx);

  // Draw vectors.

  // Try rectangle
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = 6;
  ctx.strokeStyle = "red";
  ctx.rect(player.pos.dx, player.pos.dy, player.top, -player.top);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  // Call functions.
  scoreboard();
});



// Loads the color detection GUI.
initGUIControllers(tracker);

// Scoreboard
function scoreboard(){;
  ctx.save();
  ctx.translate(0, 0);
  ctx.scale(-2, 0);
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.font = "10px Courier New";
  ctx.fillText("Scoreboard", scoreX, scoreY/2);
  ctx.fillText("Score: " + score, scoreX, scoreY);
  ctx.closePath();
  // ctx.restore();
}

function lerp(a, b, value){
  return (b - a) * value;
}
