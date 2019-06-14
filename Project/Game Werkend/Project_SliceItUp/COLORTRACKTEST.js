window.onload = function() {
 let video = document.getElementById('video');
 let canvas = document.getElementById('canvas');
 let ctx = canvas.getContext('2d');

 // Make new tracker.
 let tracker = new tracking.ColorTracker();

 // Register purple color. rgb(122, 21, 140).
 tracking.ColorTracker.registerColor('purple', function(r, g, b){
   if (r < 160 && g < 100 && b > 70){
         return true;
       }
       return false;
 });

 tracking.track('#video', tracker);

 // Make variables for middle of rect.
 let rectX;
 let rectY;
 // Setup for ball.
 let player = {};
 let lerpSpeed = 0.4;
 let lerpPosX = 0;
 let lerpPosY = 0;

 player.pos = new Vector2d(midX, midY);
 player.point = new Point(0, 0, 50, "red");


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
     rectY = rect.y + rect.width/2;


   });

   // Create lerp.
   lerpPosX = lerp(player.pos.dx, rectX, lerpSpeed);
   lerpPosY = lerp(player.pos.dy, rectY, lerpSpeed);

   // Draw ball.
   player.pos.dx += lerpPosX;
   player.pos.dy += lerpPosY;
   player.point.x = player.pos.dx;
   player.point.y = player.pos.dy;
   player.point.draw(ctx);
 });

  // Loads the color detection GUI.
  initGUIControllers(tracker);

  function lerp(a, b, value){
    return (b - a) * value;
  }
};
