 //Canvas container
var p5div = document
  .querySelector('#p5sketch');

//Canvas size
var w, h;

//P5.js sketch
var p5sketch = ( p5 ) => {
  
  p5.setup = () => {
    w = p5div.clientWidth;
    h = p5div.clientHeight;
    p5.createCanvas(w,h);
  };
  
  p5.windowResized = () => {
    w = p5div.clientWidth;
    h = p5div.clientHeight;
    
    p5.resizeCanvas(w,h);
  }

  var t1 = 0, t2 = 0, 
      t3 = 0, t4 = 0;
  var dt1 = p5.random(0.01, 0.001),
      dt2 = p5.random(0.02, 0.002), 
      dt3 = p5.random(0.03, 0.003), 
      dt4 = p5.random(0.04, 0.004);
  var rnd = p5.random(10, 80),
      wrnd = w/2,
      hrnd = h;
  p5.draw = () => {
    p5.clear();
    p5.noFill();
    p5.stroke("#101010");
    
    if(p5.frameCount%2000==0){
      rnd = p5.random(10, 80);
      wrnd = p5.random(0, w);
      hrnd = p5.random(0, h);
    }
    
    for(let i=1; i<100; i++){ 
      p5.triangle(
        wrnd, hrnd, 
        p5.abs(p5.sin(t1+i*rnd))*w,
        p5.abs(p5.cos(t2+i*rnd))*h,
        p5.abs(p5.sin(t3+i*rnd))*w,
        p5.abs(p5.cos(t4+i*rnd))*h
      );
    }
    t1 += dt1;
    t2 += dt2;
    t3 += dt3;
    t4 += dt4;
  }
}

//P5.js sketch instance
var p5inst = new p5(p5sketch, p5div);


    