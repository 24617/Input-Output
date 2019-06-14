var target = document.getElementsByClassName("overlay");

function bigImg(x,y) {
  x.style.transform = "scale(1.2)";
  switch(y) {
    case 1:
    target[0].style.opacity = "1";
    break;

    case 2:
    target[1].style.opacity = "1";
    break;

    case 3:
    target[2].style.opacity = "1";
    break;
  }
}

function normalImg(x,y) {
  x.style.transform = "scale(1.0)";

  switch(y) {
    case 1:
    target[0].style.opacity = "0";
    break;

    case 2:
    target[1].style.opacity = "0";
    break;

    case 3:
    target[2].style.opacity = "0";
    break;
  }
}
