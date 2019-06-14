// Reduce canvas.width by video width;
canvas.width = window.innerWidth-640;
canvas.height = window.innerHeight;
let midX = canvas.width/2;
let midY = canvas.height/2;

// Setup camera.
let constraints = {
  audio: false,
  video: {
    width: 640,
    height: 360
  }
};

navigator.mediaDevices.getUserMedia(constraints)
.then(function(mediaStream){
  let video = document.querySelector('video');
  video.srcObject = mediaStream;
  video.onloadedmetadata = function(e){
    video.play();
  };
})
