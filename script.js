$(document).ready(()=> {
  var initialTab = $('.btn.selected').attr('opens');
  $(`#${initialTab}`).addClass('open');
})

$(".profile").each(function() {
  var img = $(this).attr('img');

  if(img) {
    $(this).css('background-image', `url(${img})`);
  }
});

$(".profile").click(function() {
  var img = $(this).attr('img');
  var content = "No description given.";
  var link = $(this).attr('link');

  if($(this).children(".desc").length > 0) {
    content = $(this).find(".desc").html();
  }

  $("<div>", {
    class: "backdrop"
  }).appendTo("body");

  $("<div>", {
    class: "modal"
  }).appendTo("body .backdrop");

  $("<div>", {
    class: "close",
    click: function() {
      $(".backdrop").remove();
    }
  }).appendTo(".backdrop .modal");

  $("<div>", {
    class: "img",
    style: img ? `background-image: url(${img})` : ''
  }).appendTo(".backdrop .modal");

  if(link) {
    $("<a>", {
      class: "link",
      href: link,
      target: "_blank",
      html: "View Profile"
    }).appendTo(".modal .img");
  }

  $("<div>", {
    class: "desc"
  }).appendTo(".modal");

  $("<div>", {
    class: "scroller",
    html: content
  }).appendTo(".modal .desc");
})

$('.btn').click(function() {
  var opens = $(this).attr('opens');
  $('.btn.selected').removeClass('selected');
  $('.scroller.open').removeClass('open');

  $(this).addClass('selected');
  $(`#${opens}`).addClass('open');
});

$('.skills').click(function(e) {
  if(!$(this).hasClass('open') && !$(e.target).hasClass('close')) {
    $('.skills.open').removeClass('open');
    $(this).addClass('open');
  }
});

var loaded = false,
images = $(".picture").length,
curIndex;

function changePicture(ind) {
  $("#gallOverlay .bigImg").replaceWith(function(){
    return $("<img>", {
      class: "bigImg",
      src: $(".picture").eq(ind).attr("img"),
      alt: "Image not available"
    });
  });
}

$(".picture, .skills").each(function() {
  let $elem = $(this),
      img = $elem.attr("img");

  $elem.css("background-image", `url(${img})`);
})

$(".picture").click(function(){
  console.log("clicked");
  var curIndex = $(this).index();

  $("<div>", {
    id: "gallOverlay"
  }).appendTo("#modals")

  $("<div>", {
    id: "gallOverlay-content"
  }).appendTo("#gallOverlay");

  $("<div>", {
    id: "gallExit",
    click: function() {
      $("#gallOverlay").fadeOut(200);
      setTimeout(function() {
        $("#gallOverlay").remove();
      }, 200);
    }
  }).appendTo("#gallOverlay-content");

  $("<div>", {
    class: "gallNav prev",
    click: function() {
      if(curIndex == 0) {
        curIndex = images - 1;
      } else {
        --curIndex
      }

      changePicture(curIndex);
    }
  }).appendTo("#gallOverlay-content");

  $("<img>", {
    class: "bigImg",
    src: $(this).attr("img"),
    alt: "Image is unavailable"
  }).appendTo("#gallOverlay-content");

  $("<div>", {
    class: "gallNav next",
    click: function() {
      if(curIndex == images - 1) {
        curIndex = 0;
      } else {
        curIndex++
      }

      changePicture(curIndex);
    }
  }).appendTo("#gallOverlay-content");

  $("#gallOverlay").fadeIn(200);
});

var WIDTH;
var HEIGHT;
var canvas;
var con;
var g;
var pxs = new Array();
var rint = 50;
$(document).ready(function () {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  $("#container").width(WIDTH).height(HEIGHT);
  canvas = document.getElementById("pixie");
  $(canvas).attr("width", WIDTH).attr("height", HEIGHT);
  con = canvas.getContext("2d");
  for (var a = 0; a < 80; a++) {
    pxs[a] = new Circle();
    pxs[a].reset()
  }
  setInterval(draw, rint);
  setInterval(draw, rint);
});

function draw() {
  con.clearRect(0, 0, WIDTH, HEIGHT);
  for (var a = 0; a < pxs.length; a++) {
    pxs[a].fade();
    pxs[a].move();
    pxs[a].draw()
  }
}

function Circle() {
  this.s = {
    ttl: 8000,
    xmax: 10,
    ymax: 4,
    rmax: 12,
    rt: 1,
    xdef: 960,
    ydef: 540,
    xdrift: 4,
    ydrift: 4,
    random: true,
    blink: true
  };
  this.reset = function () {
    this.x = (this.s.random ? WIDTH * Math.random() : this.s.xdef);
    this.y = (this.s.random ? HEIGHT * Math.random() : this.s.ydef);
    this.r = ((this.s.rmax - 1) * Math.random()) + 1;
    this.dx = (Math.random() * this.s.xmax) * (Math.random() < 0.5 ? -1 : 1);
    this.dy = (Math.random() * this.s.ymax) * (Math.random() < 0.5 ? -1 : 1);
    this.hl = (this.s.ttl / rint) * (this.r / this.s.rmax);
    this.rt = Math.random() * this.hl;
    this.s.rt = Math.random() + 1;
    this.stop = Math.random() * 0.2 + 0.4;
    this.s.xdrift *= Math.random() * (Math.random() < 0.5 ? -1 : 1);
    this.s.ydrift *= Math.random() * (Math.random() < 0.5 ? -1 : 1)
  };
  this.fade = function () {
    this.rt += this.s.rt
  };
  this.draw = function () {
    if (this.s.blink && (this.rt <= 0 || this.rt >= this.hl)) {
      this.s.rt = this.s.rt * -1
    } else {
      if (this.rt >= this.hl) {
        this.reset()
      }
    }
    var b = 1 - (this.rt / this.hl);
    con.beginPath();
    con.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
    con.closePath();
    var a = this.r * b;
    g = con.createRadialGradient(this.x, this.y, 0, this.x, this.y, (a <= 0 ? 1 : a));
    g.addColorStop(0, "rgba(238,180,28," + b + ")");
    g.addColorStop(this.stop, "rgba(238,180,28," + (b * 0.2) + ")");
    g.addColorStop(1, "rgba(238,180,28,0)");
    con.fillStyle = g;
    con.fill()
  };
  this.move = function () {
    this.x += (this.rt / this.hl) * this.dx;
    this.y += (this.rt / this.hl) * this.dy;
    if (this.x > WIDTH || this.x < 0) {
      this.dx *= -1
    }
    if (this.y > HEIGHT || this.y < 0) {
      this.dy *= -1
    }
  };
  this.getX = function () {
    return this.x
  };
  this.getY = function () {
    return this.y
  }
};