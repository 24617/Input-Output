let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let midX = canvas.width/2;
let midY = canvas.height/2;

// Setup camera resolution.
let constraints = {
  audio: false,
  video: {
    width: 1280,
    height: 720
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


// if (navigator.mediaDevices.getUserMedia){
//   navigator.mediaDevices.getUserMedia(constraints, streamWebcam, throwError);
// }

function streamWebcam(stream){
  video.src = window.URL.createObjectURL(stream);
  video.play();
}

function throwError(e){
  alert(e.name);
}
