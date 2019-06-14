const handTrack = window.handTrack;
const modelParams = {
  flipHorizontal: true,
  imageScaleFactor: 0.7,
  maxNumBoxes: 1,
  iouThreshold: 0.5,
  scoreThreshold: 0.6,
}

let isVideo = false;
let model = null;
let videoInterval = 100;

function startVideo(){
  handTrack.startVideo(video).then(function (status){
    console.log("video started", status);
    if (status){
      isVideo = true;
      runDetection();
    } else {
      return;
    }
  })
}

function runDetection() {
  model.detect(video).then(predictions => {
    // console.log("Predictions: ", predictions);
    // Get the middle x value of the bounding box and map to paddle location
    model.renderPredictions(predictions, canvas, context, video);
    if (predictions[0]) {
      let midval = predictions[0].bbox[0] + (predictions[0].bbox[2] / 2)
      gamex = document.body.clientWidth * (midval / video.width);
      updatePaddleControl(gamex)
      console.log("Predictions: ", gamex);
    }
    if (isVideo) {
      setTimeout(() => {
        runDetection(video)
      }, videoInterval);
    }
  });
}

// Load the model.
handTrack.load(modelParams).then(lmodel => {
  // Detect objects in the image.
  model = lmodel;
});
