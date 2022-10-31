document.addEventListener("DOMContentLoaded", function(e) {
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var posX = e.pageX;
    var posY = e.pageY;
    ctx = document.querySelector(".contextmenu");
    var menuWidth = ctx.clientWidth;
    var menuHeight = ctx.clientHeight;
    var secMargin = 10;
    if(posX + menuWidth + secMargin >= winWidth
    && posY + menuHeight + secMargin >= winHeight){
      posLeft = posX - menuWidth - secMargin + "px";
      posTop = posY - menuHeight - secMargin + "px";
    }
    else if(posX + menuWidth + secMargin >= winWidth){
      posLeft = posX - menuWidth - secMargin + "px";
      posTop = posY + secMargin + "px";
    }
    else if(posY + menuHeight + secMargin >= winHeight){
      posLeft = posX + secMargin + "px";
      posTop = posY - menuHeight - secMargin + "px";
    }
    else {
      posLeft = posX + secMargin + "px";
      posTop = posY + secMargin + "px";
    };
    ctx.style.left = posLeft;
    ctx.style.top = posTop;
    ctx.style.display = "block";
  });
  document.addEventListener('click', function(e) { 
    document.querySelector(".contextmenu").style.display = "none"; 
  });
});

window.addEventListener('load', function (e) { setTimeout(fadeOut(document.querySelector('#page-preloader'),50), 350); })

var ps = new PagesStack();