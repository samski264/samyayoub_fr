var boxSz = 300;
var sphereRadius = boxSz - boxSz / 10;

function setup() {
  var myCanvas = createCanvas(windowWidth, windowHeight, WEBGL);
  myCanvas.parent("p5");
}

function draw() {
  background(0, 0, 0, 0);
  // rotate scene

  // spin entire sphere
  rotateX(mouseY / 430);
  rotateZ(mouseX / 430);
  rotateY(frameCount * 0.0054);

  specularMaterial(255, 255, 255);

  pointLight(255, 0, 255, 200, 0, mouseX);
  pointLight(255, 0, 255, 200, 0, mouseX);
  pointLight(0, 0, 255, mouseY, 200, 0);

  pointLight(0, 0, 0, 200, 0, 0);
  pointLight(0, 0, 255, 0, 200, 0);

  pointLight(255, 0, 0, 200, 0, 0);
  pointLight(0, mouseY, 255, 0, 200, mouseX);

  pointLight(255, 0, 0, 0, 0, 200);
  pointLight(0, 0, 255, -200, mouseX, 0);

  pointLight(255, 0, 0, 0, 0, 200);

  pointLight(255, 0, 0, 0, 0, 200);

  pointLight(255, 0, 0, 0, 0, 200);

  // directionalLight(255,255,255, 0, 0, -1);

  noStroke();

  // move along sphere
  for (var s = 16; s <= 180 - 16; s += 10) {
    var radianS = radians(s);
    var z = sphereRadius * Math.cos(radianS);
    // draw complete circle of points
    for (var t = 0; t < 360; t += 8) {
      var radianT = radians(t);
      var radius = sphereRadius * Math.sin(radianS);
      var x = radius * Math.cos(radianT);
      var y = radius * Math.sin(radianT);
      // draw sphere at p]oint
      push();
      translate(x, y, z);
      cylinder(8, 16, 8, 1);
      //sphere(5, 8);
      pop();
    }
  }

  // push();
  // //rotateX(frameCount *0.02);
  // for (var i = 0; i < lines.length; i++) {
  //   push();
  //   line(0, 0, 0, lines[i].x, lines[i].y, lines[i].z);
  //   pop();
  // }
  // pop();
  //drawBox();
} // draw

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
