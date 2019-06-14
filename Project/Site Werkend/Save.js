var cacheDom = "";


$(document).on("click", function () {

  $('.overlay').click(function(){
    $(".container").css("transform", "scale(1.0)");
    $(".otherOverlay").css("opacity", "0");
    $(".overlay").css("opacity", "0");
    $("#header").css("height", "50");
    $("#HeaderText").css("fontSize", 35);
    cacheDom = $('.fullDivs');
    $('.fullDivs').remove();

    $('.backDivs').append('<div class="fullDivs"> </div>');
    $('.fullDivs').append('<iframe src="Game_1/index.html" class="FrameGame"> </iframe>');
    $('.fullDivs').append('<div float="right" class="VideoPlace"></div>');
    $('.VideoPlace').append('<video class="video" id="video" autoplay="true"></video>');
    $('.VideoPlace').append('<button class="add">go back</button>');

    let constraints = {
      audio: false,
      video: {
        width: 448,
        height: 252
      }
    };

    for (i = 0; i < 1; i++){
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream){
      let video = document.querySelector('video');
      video.srcObject = mediaStream;
      video.onloadedmetadata = function(e){
        video.play();
      };
    })
  }
  $('.FrameGame').attr('allow', "camera");

  });


  $('.CoverImage').click(function(){
    $(".container").css("transform", "scale(1.0)");
    $(".otherOverlay").css("opacity", "0");
    $(".overlay").css("opacity", "0");
    $("#header").css("height", "50");
    $("#HeaderText").css("fontSize", 35);
    cacheDom = $('.fullDivs');
    $('.fullDivs').remove();

    $('.backDivs').append('<div class="fullDivs"> </div>');
    $('.fullDivs').append('<iframe src="Game_1/index.html" class="FrameGame" > </iframe>');
    $('.fullDivs').append('<div float="right" class="VideoPlace" ></div>');
    $('.VideoPlace').append('<video class="video" id="video" autoplay="true"></video>');
    $('.VideoPlace').append('<button class="add">go back</button>');

    let constraints = {
      audio: false,
      video: {
        width: 448,
        height: 252
      }
    };

    for (i = 0; i < 2; i++){
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream){
      let video = document.querySelector('video');
      video.srcObject = mediaStream;
      video.onloadedmetadata = function(e){
        video.play();
      };
    })
  }
    $('.FrameGame').attr('allow', "camera");

});

    $('.add').click(function(){
      $('.fullDivs').remove();
       $("#header").css("height", "100");
       $("#HeaderText").css("fontSize", 80);
       $('.backDivs').append(cacheDom);
     });
});
