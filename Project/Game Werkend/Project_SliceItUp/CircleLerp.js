var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var width = window.innerWidth;
var height = window.innerHeight;
var x = window.innerWidth/2;
var y = window.innerHeight/2;
var ballX = x;
var ballY = y;
resize();

function drawBall() {
  ctx.beginPath();
  // instead of updating the ball position to the mouse position we will lerp 10% of the distance between the balls current position and the mouse position.
  ballX += (x - ballX)*0.1;
  ballY += (y - ballY)*0.1;
  ctx.arc(ballX, ballY, 40, 0, 2*Math.PI);
  ctx.fillStyle = '#9e356a';
  ctx.fill();
}

function loop() {
  ctx.clearRect(0, 0, width, height);
  drawBall();
  requestAnimationFrame(loop);
}

loop();


function mousemove(e) {
  x = e.pageX;
  y = e.pageY;
}

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', mousemove);
