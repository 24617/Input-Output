window.onload = function() {
 let video = document.getElementById('video');
 let canvas = document.getElementById('canvas');
 let context = canvas.getContext('2d');

 let tracker = new tracking.ColorTracker();

 // Register purple color. rgb(122, 21, 140).
 tracking.ColorTracker.registerColor('purple', function(r, g, b){
   if (r < 160 && g < 100 && b > 70){
         return true;
       }
       return false;
 });

 // Track this color.
 let color = new tracking.ColorTracker('purple');

 tracking.track('#video', tracker, { camera: true });

 tracker.on('track', function(event) {
   context.clearRect(0, 0, canvas.width, canvas.height);
   event.data.forEach(function(rect) {
     if (rect.color === 'custom') {
       rect.color = tracker.customColor;
     }
     context.strokeStyle = rect.color;
     context.strokeRect(rect.x, rect.y, rect.width, rect.height);
     context.font = '11px Helvetica';
     context.fillStyle = "#fff";
     context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
     context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
   });
 });

initGUIControllers(tracker);

};
